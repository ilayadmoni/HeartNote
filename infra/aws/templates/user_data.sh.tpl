#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y docker git nginx certbot python3-certbot-nginx
systemctl enable --now docker
systemctl enable --now nginx

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
NEXT_PUBLIC_SITE_URL=https://${site_domain}
AUTH_URL=https://${site_domain}
AUTH_TRUST_HOST=true
ALLOWED_ORIGINS=https://www.${site_domain}
EOF
chmod 600 .env

docker build --target builder -t heartnote-builder .
docker run --rm --env-file .env heartnote-builder npx prisma migrate deploy

docker build --target runner -t heartnote-app .
docker rm -f heartnote 2>/dev/null || true
docker run -d --name heartnote --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file .env heartnote-app

cat > /etc/nginx/conf.d/heartnote.conf <<NGINX
server {
    listen 80;
    server_name ${site_domain} www.${site_domain};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
nginx -t && systemctl reload nginx
