#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker git
systemctl enable --now docker

TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
PUBLIC_IP=$(curl -sH "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)

rm -rf /opt/heartnote
git clone --branch ${app_branch} --depth 1 ${github_repo_url} /opt/heartnote
cd /opt/heartnote/client

cat > .env <<EOF
DATABASE_URL=postgresql://${db_username}:${db_password}@${db_endpoint}/${db_name}
AUTH_SECRET=${auth_secret}
AUTH_GOOGLE_ID=${auth_google_id}
AUTH_GOOGLE_SECRET=${auth_google_secret}
RESEND_KEY=${resend_key}
MAIL_HEART_NOTE=${mail_heart_note}
NEXT_PUBLIC_SITE_URL=http://$PUBLIC_IP
EOF
chmod 600 .env

docker build --target builder -t heartnote-builder .
docker run --rm --env-file .env heartnote-builder npx prisma migrate deploy

docker build --target runner -t heartnote-app .
docker rm -f heartnote 2>/dev/null || true
docker run -d --name heartnote --restart unless-stopped -p 80:3000 --env-file .env heartnote-app
