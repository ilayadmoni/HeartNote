terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── Default VPC — avoids the cost/complexity of a custom VPC + NAT gateway.
# A NAT gateway alone costs ~$0.045/hr + data processing, is NOT Free Tier
# eligible, and isn't needed here since the DB only needs to be reachable
# from the app server, not the internet. ──────────────────────────────────
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# ── Security groups ─────────────────────────────────────────────────────

resource "aws_security_group" "app" {
  name        = "heartnote-app-sg"
  description = "HeartNote EC2 app server"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH — restrict to your own IP, never 0.0.0.0/0"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "heartnote-app-sg" }
}

resource "aws_security_group" "db" {
  name        = "heartnote-db-sg"
  description = "HeartNote RDS Postgres — reachable only from the app server, never the internet"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres from the app server only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "heartnote-db-sg" }
}

# ── RDS (PostgreSQL, Free Tier: db.t3.micro, Single-AZ, 20GB gp3) ───────

resource "aws_db_subnet_group" "default" {
  name       = "heartnote-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_db_instance" "postgres" {
  identifier              = "heartnote-db"
  engine                  = "postgres"
  engine_version          = "16"
  instance_class          = var.rds_instance_class
  allocated_storage       = 20 # Free Tier includes up to 20GB gp3/gp2
  storage_type            = "gp3"
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.default.name
  vpc_security_group_ids  = [aws_security_group.db.id]
  publicly_accessible     = false
  multi_az                = false # Multi-AZ is NOT Free Tier eligible
  backup_retention_period = 1
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = { Name = "heartnote-db" }
}

# ── EC2 app server (Free Tier: t3.micro) ────────────────────────────────

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.ec2_instance_type
  key_name               = var.ssh_key_name
  vpc_security_group_ids = [aws_security_group.app.id]
  subnet_id              = data.aws_subnets.default.ids[0]

  # Auto-installs Docker, the Docker Compose plugin, and Git on first boot.
  # See user_data.sh for what it does and (importantly) what it deliberately
  # does NOT do — no secrets or repo credentials belong in user_data.
  user_data = file("${path.module}/user_data.sh")

  root_block_device {
    volume_size = 20 # Free Tier includes up to 30GB EBS — stay well under
    volume_type = "gp3"
  }

  tags = { Name = "heartnote-app" }
}
