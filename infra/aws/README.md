# HeartNote AWS Infra — EC2 + RDS

**Status: prepared, NOT applied.** Nothing in this directory has been run
against AWS. No resources exist yet.

## What this provisions

- 1× EC2 `t3.micro` (Amazon Linux 2023) — the app server
- 1× RDS PostgreSQL `db.t3.micro`, Single-AZ, 20GB gp3 — the database
- Security groups: SSH restricted to your IP, HTTP/HTTPS open, Postgres
  reachable only from the app server's security group (never public)
- Default VPC (no NAT gateway, no Multi-AZ, no load balancer) — keeps this
  inside Free Tier and avoids the always-billed pieces (NAT gateways run
  ~$0.045/hr regardless of Free Tier status)

## Free Tier eligibility (verify against your actual account)

AWS's Free Tier terms changed on **July 15, 2025**:

| | Account before Jul 15 2025 | Account on/after Jul 15 2025 |
|---|---|---|
| Duration | 12 months | 6 months, or until credits run out |
| EC2 types | `t2.micro`, `t3.micro` | `t3.micro`, `t3.small`, `t4g.micro`, `t4g.small` |
| RDS types | `db.t3.micro`, `db.t4g.micro` | same |
| Hours included | 750/month each for EC2 and RDS | same, but capped so you can't exceed it |
| Can you get billed unexpectedly? | Yes, if you exceed 750 hrs/month or add ineligible resources | No — usage stops when credits are exhausted |

750 hours/month covers one instance running 24/7 (a month has ~730 hours),
so **one EC2 + one RDS instance, each running continuously, should stay
inside Free Tier** either way.

## Estimated cost

**Within Free Tier: $0/month** for the EC2 + RDS compute and the 20GB of
storage each. Real $0 depends on not exceeding 750 hrs/month per service and
not adding other billed resources (Elastic IPs while *unattached*, extra
EBS/RDS storage, data transfer beyond the free 100GB/month out, snapshots
beyond the included backup storage).

**If Free Tier doesn't apply / after it expires** (rough on-demand pricing,
verify current numbers on the [AWS Pricing Calculator](https://calculator.aws) —
these vary by region and change over time):

| Resource | Approx. cost |
|---|---|
| EC2 `t3.micro` (24/7) | ~$7–8/month |
| RDS `db.t3.micro` Single-AZ (24/7) | ~$12–13/month |
| RDS 20GB gp3 storage | ~$2–3/month |
| EC2 20GB gp3 storage | ~$2/month |
| **Total, all-in** | **~$23–26/month** |

You mentioned a $200 credit balance through Feb 2027 — at that burn rate,
even if something pushed you outside strict Free Tier limits, the credit
alone covers this setup for 7–8+ months.

## Before running this

1. Install Terraform and the AWS CLI locally, with credentials for your account.
2. Create an EC2 key pair if you don't have one: `aws ec2 create-key-pair --key-name heartnote --query 'KeyMaterial' --output text > heartnote.pem`
3. Find your own public IP for `ssh_allowed_cidr` (e.g. `curl ifconfig.me`) — **never** set this to `0.0.0.0/0`.
4. Create `infra/aws/terraform.tfvars` (gitignored) with your values:
   ```hcl
   ssh_key_name     = "heartnote"
   ssh_allowed_cidr = "YOUR.IP.HERE/32"
   ```
5. Set the DB password via environment variable, not in a file:
   ```bash
   export TF_VAR_db_password='choose-a-strong-password'
   ```
6. Review the plan before applying anything:
   ```bash
   cd infra/aws
   terraform init
   terraform plan
   ```
7. Only after reviewing the plan output: `terraform apply`

## After apply

- `terraform output rds_endpoint` gives you the DB host for `DATABASE_URL` on the EC2 instance.
- `db/schema.sql` (repo root) still needs to be loaded into the new RDS database the same way it was loaded locally.
- The EC2 instance is bare — it still needs Node.js, the app checked out, `.env` configured, and a process manager (pm2 or a systemd unit) plus a reverse proxy (nginx) for ports 80/443. That setup isn't in this Terraform yet.
