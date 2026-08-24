variable "aws_region" {
  description = "AWS region. il-central-1 (Tel Aviv) gives the lowest latency to HeartNote's Israeli users; verify Free Tier resource availability there before relying on it, or use us-east-1 as the safest fallback."
  type        = string
  default     = "il-central-1"
}

variable "ec2_instance_type" {
  description = "Free Tier eligible: t2.micro/t3.micro (accounts before Jul 15 2025) or t3.micro/t3.small/t4g.micro/t4g.small (accounts on/after)."
  type        = string
  default     = "t3.micro"
}

variable "rds_instance_class" {
  description = "Free Tier eligible: db.t3.micro or db.t4g.micro, Single-AZ only."
  type        = string
  default     = "db.t3.micro"
}

variable "ssh_key_name" {
  description = "Name of an existing EC2 key pair (create one first: aws ec2 create-key-pair)."
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "Your IP in CIDR form, e.g. 1.2.3.4/32. Never leave this as 0.0.0.0/0 — that opens SSH to the entire internet."
  type        = string
}

variable "db_name" {
  type    = string
  default = "heartnote"
}

variable "db_username" {
  type    = string
  default = "heartnote"
}

variable "db_password" {
  description = "RDS master password. Pass via TF_VAR_db_password env var — never commit a real value here."
  type        = string
  sensitive   = true
}
