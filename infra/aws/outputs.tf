output "ec2_public_ip" {
  description = "SSH here, and point DNS at this for the app server."
  value       = aws_instance.app.public_ip
}

output "rds_endpoint" {
  description = "Use this as the host in DATABASE_URL on the EC2 instance."
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  value = aws_db_instance.postgres.port
}
