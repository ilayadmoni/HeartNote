output "ec2_public_ip" {
  description = "SSH here, and point DNS at this for the app server. Not static — changes if the instance stops/restarts."
  value       = aws_instance.app.public_ip
}

output "rds_endpoint" {
  description = "Use this as the host in DATABASE_URL on the EC2 instance."
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  value = aws_db_instance.postgres.port
}

output "ec2_instance_id" {
  description = "Set as the EC2_INSTANCE_ID GitHub Actions secret."
  value       = aws_instance.app.id
}

output "github_deploy_role_arn" {
  description = "Set as the AWS_DEPLOY_ROLE_ARN GitHub Actions secret."
  value       = aws_iam_role.github_deploy.arn
}
