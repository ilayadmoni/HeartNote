# Move Docker build off the EC2 box into CI

## Problem
`deploy.sh` runs `docker build` on the EC2 t3.micro (1GB RAM). The app has grown
(606 files, full i18n bundle) and `next build` now swap-thrashes indefinitely
inside the box instead of completing — CI's "Wait for deploy to finish" step
gave up after ~18 min while the SSM command was still `InProgress`. Confirmed
via SSM diagnostic: `next build` process state `Dl` (disk-wait), 67Mi RAM free,
1.1Gi/2.0Gi swap used, never reached completion.

Bumping `NODE_OPTIONS=--max-old-space-size` (the fix used last time, commit
cab213b) doesn't help — this isn't a heap crash, it's a physical RAM ceiling.
Resizing the instance was ruled out (no Elastic IP — a resize changes the
public IP and breaks DNS until manually repointed).

## Fix
Build the Docker image in GitHub Actions (ample RAM), ship the built image to
EC2 as a tarball via S3, and have `deploy.sh` load it instead of building it.
The box never runs `next build` again.

## Changes

### 1. `.github/workflows/ci.yml`
- In the `deploy` job (after `test` passes, before triggering EC2 deploy):
  - `docker build -t heartnote-app:${{ github.sha }} client/` (runner target,
    same Dockerfile)
  - `docker save heartnote-app:${{ github.sha }} | gzip > heartnote-app.tar.gz`
  - `aws s3 cp heartnote-app.tar.gz s3://<bucket>/releases/${{ github.sha }}.tar.gz`
- Pass the image tag/SHA to `deploy.sh` via the SSM command parameters (env
  var or arg) so it knows which tarball to pull.

### 2. `infra/aws/main.tf`
- New `aws_s3_bucket` for release artifacts (private, lifecycle rule to expire
  old releases after N days to control storage cost).
- Extend the existing deploy IAM role (used by the OIDC `AWS_DEPLOY_ROLE_ARN`)
  with `s3:PutObject` on that bucket.
- Extend the EC2 instance role (`aws_iam_instance_profile.ec2_ssm`) with
  `s3:GetObject` on that bucket.

### 3. `infra/aws/deploy.sh`
- Replace `docker build --target builder ...` / `docker build --target runner
  ...` with:
  - `aws s3 cp s3://<bucket>/releases/$GIT_SHA.tar.gz /tmp/`
  - `gunzip -c /tmp/$GIT_SHA.tar.gz | docker load`
  - Tag/reference the loaded image for the `prisma db push` step and the
    `docker run` restart (same as today — db push and restart logic unchanged).
- Everything downstream (health check, `docker image prune`) stays the same.

### 4. `infra/aws/variables.tf` / `outputs.tf`
- Add a variable for the S3 bucket name if not hardcoded; expose bucket name
  as an output for reference.

## Rollout
- `terraform apply` first (new bucket + IAM policy) — no instance replacement,
  no downtime.
- Then merge the `ci.yml` + `deploy.sh` changes.
- Test with a push to `dev` first if possible, or a manual `workflow_dispatch`
  if one gets added — otherwise verify on the next real `main` push.

## Out of scope
- Prisma `db push` stays on the EC2 box (per earlier decision) — CI never
  touches prod DB credentials.
- No registry (ECR/GHCR) — S3 tarball only, per decision to avoid extra moving
  parts.
