# ── Release artifacts bucket ─────────────────────────────────────────────
# CI builds the Docker image (the box's 1GB RAM can't run `next build`
# reliably once the app got large enough to swap-thrash) and drops the
# tarball here; deploy.sh downloads and `docker load`s it instead of
# building on the instance.

resource "aws_s3_bucket" "releases" {
  bucket = "heartnote-releases-${data.aws_caller_identity.current.account_id}"

  tags = { Name = "heartnote-releases" }
}

resource "aws_s3_bucket_lifecycle_configuration" "releases" {
  bucket = aws_s3_bucket.releases.id

  rule {
    id     = "expire-old-releases"
    status = "Enabled"

    filter {}

    expiration {
      days = 14
    }
  }
}

resource "aws_s3_bucket_public_access_block" "releases" {
  bucket                  = aws_s3_bucket.releases.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
