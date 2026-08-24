#!/bin/bash
# Runs automatically once, the first time the EC2 instance boots (via the
# `user_data` argument on aws_instance.app in main.tf). Installs everything
# needed to run the app via Docker — nothing manual required for this part.
#
# Deliberately does NOT clone the repo or write any secrets here: user_data
# is stored in EC2 instance metadata in plain text, readable by anyone with
# API access to the instance — never put credentials, tokens, or .env
# contents in this file. Cloning the repo and creating .env is the one
# manual SSH step left (see infra/aws/README.md).

set -euo pipefail

dnf update -y

# Docker
dnf install -y docker git
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# Docker Compose plugin (the `docker compose` subcommand)
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
