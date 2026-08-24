#!/usr/bin/env bash
# Tears down every resource this Terraform config created (EC2 + RDS +
# security groups). Run this from infra/aws/ once you're done with the
# environment, or on a schedule before your credit/plan expires.
#
# Requires: terraform + AWS CLI already configured, and the same
# terraform.tfvars / TF_VAR_db_password used to create the resources
# (Terraform needs its state file, created by `terraform apply`, to know
# what to delete — this won't work from a machine that never ran apply).

set -euo pipefail
cd "$(dirname "$0")"

echo "About to DESTROY all resources in this Terraform state."
echo "This deletes the EC2 instance and the RDS database — including its data."
read -r -p "Type 'destroy' to confirm: " confirm
if [ "$confirm" != "destroy" ]; then
  echo "Aborted."
  exit 1
fi

terraform destroy -auto-approve
