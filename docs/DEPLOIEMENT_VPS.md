# 🚀 Guide de Déploiement VPS Complet
## Plateforme d'Indemnisation - Configuration Production

**Date de création** : 29 Octobre 2025
**Dernière mise à jour** : 29 Octobre 2025
**Pour** : Phase 3 - Déploiement Production sur VPS

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Préparation du VPS](#préparation-du-vps)
3. [Installation des Services](#installation-des-services)
4. [Configuration de la Base de Données](#configuration-de-la-base-de-données)
5. [Déploiement Backend (NestJS/Fastify)](#déploiement-backend)
6. [Déploiement Frontend (Next.js 15)](#déploiement-frontend)
7. [Configuration Nginx](#configuration-nginx)
8. [SSL/HTTPS avec Let's Encrypt](#ssl-https)
9. [Configuration PM2](#configuration-pm2)
10. [Monitoring et Logs](#monitoring-et-logs)
11. [Backups Automatiques](#backups-automatiques)
12. [Sécurité](#sécurité)
13. [CI/CD avec GitHub Actions](#cicd)
14. [Troubleshooting](#troubleshooting)

---

## 1️⃣ PRÉREQUIS

### VPS Recommandé
```yaml
Fournisseur: OVH, Hetzner, DigitalOcean, Contabo
OS: Ubuntu 22.04 LTS (ou 24.04 LTS)
RAM: 4 GB minimum (8 GB recommandé)
CPU: 2 vCPU minimum
Stockage: 50 GB SSD minimum
Bande passante: 1 TB/mois minimum
```

### Domaines
```
Frontend: indemnisation.votredomaine.com
Backend API: api.indemnisation.votredomaine.com
Admin: admin.indemnisation.votredomaine.com
```

### Accès
- Accès SSH root ou sudo
- Clés SSH configurées (recommandé)
- Nom de domaine configuré avec DNS

---

## 2️⃣ PRÉPARATION DU VPS

### Connexion initiale
```bash
ssh root@YOUR_VPS_IP

# Ou avec clé SSH
ssh -i ~/.ssh/your_key root@YOUR_VPS_IP
```

### Mise à jour système
```bash
# Mettre à jour les paquets
apt update && apt upgrade -y

# Installer les outils de base
apt install -y curl wget git build-essential software-properties-common ufw fail2ban
```

### Créer un utilisateur non-root
```bash
# Créer l'utilisateur
adduser deploy
usermod -aG sudo deploy

# Copier les clés SSH (si utilisées)
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

### Configuration du firewall
```bash
# Configurer UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Vérifier le statut
ufw status
```

---

## 3️⃣ INSTALLATION DES SERVICES

### Node.js 20 LTS
```bash
# Installer NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Installer Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Vérifier
node --version  # v20.x.x
npm --version   # 10.x.x
```

### PostgreSQL 15
```bash
# Ajouter le repository PostgreSQL
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# Installer PostgreSQL
apt update
apt install -y postgresql-15 postgresql-contrib-15

# Démarrer le service
systemctl start postgresql
systemctl enable postgresql

# Vérifier
sudo -u postgres psql --version
```

### Redis (pour le cache)
```bash
# Installer Redis
apt install -y redis-server

# Configurer Redis
sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf

# Redémarrer Redis
systemctl restart redis-server
systemctl enable redis-server

# Vérifier
redis-cli ping  # Devrait répondre "PONG"
```

### Nginx
```bash
# Installer Nginx
apt install -y nginx

# Démarrer Nginx
systemctl start nginx
systemctl enable nginx

# Vérifier
systemctl status nginx
```

### PM2 (Process Manager)
```bash
# Installer PM2 globalement
npm install -g pm2

# Configurer PM2 au démarrage
pm2 startup systemd
# Suivre les instructions affichées

# Vérifier
pm2 --version
```

---

## 4️⃣ CONFIGURATION DE LA BASE DE DONNÉES

### Créer la base de données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer l'utilisateur et la base
CREATE USER indemnisation_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';
CREATE DATABASE indemnisation_prod;
GRANT ALL PRIVILEGES ON DATABASE indemnisation_prod TO indemnisation_user;

# Quitter
\q
```

### Sécuriser PostgreSQL
```bash
# Éditer pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Changer la méthode d'authentification pour local
# DE: local   all             all                                     peer
# À:  local   all             all                                     md5

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Configurer les backups automatiques
```bash
# Créer le script de backup
sudo nano /usr/local/bin/backup-db.sh
```

Contenu du script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="indemnisation_prod"
DB_USER="indemnisation_user"

mkdir -p $BACKUP_DIR

# Backup avec compression
PGPASSWORD='VOTRE_MOT_DE_PASSE' pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_${TIMESTAMP}.sql.gz"
```

```bash
# Rendre le script exécutable
chmod +x /usr/local/bin/backup-db.sh

# Créer le cron job (tous les jours à 2h du matin)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/db-backup.log 2>&1") | crontab -
```

---

## 5️⃣ DÉPLOIEMENT BACKEND

### Cloner le repository
```bash
# En tant qu'utilisateur deploy
su - deploy

# Créer le répertoire
mkdir -p /home/deploy/indemnisation
cd /home/deploy/indemnisation

# Cloner le projet
git clone https://github.com/VOTRE_USERNAME/indemnisation.git .

# Ou avec clé de déploiement
git clone git@github.com:VOTRE_USERNAME/indemnisation.git .
```

### Configuration du backend
```bash
cd apps/api

# Copier et configurer .env
cp .env.example .env
nano .env
```

Contenu du `.env` de production:
```env
# Database
DATABASE_URL="postgresql://indemnisation_user:VOTRE_MOT_DE_PASSE@localhost:5432/indemnisation_prod?schema=public"

# JWT
JWT_SECRET="GENERER_UNE_CLE_SECRETE_FORTE_ICI_64_CARACTERES_MIN"
JWT_REFRESH_SECRET="AUTRE_CLE_SECRETE_FORTE_POUR_REFRESH_TOKEN"
JWT_EXPIRATION="1h"
JWT_REFRESH_EXPIRATION="7d"

# API
PORT=3001
NODE_ENV="production"
API_URL="https://api.indemnisation.votredomaine.com"
FRONTEND_URL="https://indemnisation.votredomaine.com"

# Redis Cache
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_TTL=3600

# CORS
CORS_ORIGINS="https://indemnisation.votredomaine.com,https://admin.indemnisation.votredomaine.com"

# Email (à configurer avec votre service)
SMTP_HOST="smtp.votreserveur.com"
SMTP_PORT=587
SMTP_USER="noreply@indemnisation.votredomaine.com"
SMTP_PASS="VOTRE_MOT_DE_PASSE_EMAIL"
SMTP_FROM="noreply@indemnisation.votredomaine.com"

# File Upload
UPLOAD_DIR="/home/deploy/indemnisation/uploads"
MAX_FILE_SIZE=10485760  # 10 MB en bytes

# Logging
LOG_LEVEL="info"
LOG_DIR="/home/deploy/indemnisation/logs"
```

### Générer des clés secrètes fortes
```bash
# Générer JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Installer les dépendances et build
```bash
# Installer les dépendances
npm install --production=false

# Générer Prisma Client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Seed la base de données (aéroports, admin initial, etc.)
npm run seed

# Build l'application
npm run build

# Créer les dossiers nécessaires
mkdir -p /home/deploy/indemnisation/uploads
mkdir -p /home/deploy/indemnisation/logs
```

### Configuration PM2 pour le backend
```bash
# Créer le fichier de configuration PM2
nano ecosystem.config.js
```

Contenu de `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'indemnisation-api',
    script: 'dist/main.js',
    cwd: '/home/deploy/indemnisation/apps/api',
    instances: 2,  // Utiliser 2 instances pour load balancing
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/home/deploy/indemnisation/logs/api-error.log',
    out_file: '/home/deploy/indemnisation/logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
```

```bash
# Démarrer l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Vérifier que tout fonctionne
pm2 status
pm2 logs indemnisation-api --lines 50
```

---

## 6️⃣ DÉPLOIEMENT FRONTEND

### Configuration du frontend
```bash
cd /home/deploy/indemnisation/apps/web

# Copier et configurer .env
cp .env.example .env.production.local
nano .env.production.local
```

Contenu du `.env.production.local`:
```env
# API URL
NEXT_PUBLIC_API_URL=https://api.indemnisation.votredomaine.com

# App URL
NEXT_PUBLIC_APP_URL=https://indemnisation.votredomaine.com

# Locales
NEXT_PUBLIC_DEFAULT_LOCALE=fr
NEXT_PUBLIC_LOCALES=fr,he,en
```

### Build le frontend
```bash
# Installer les dépendances
npm install --production=false

# Build l'application Next.js
npm run build

# Tester le build localement
npm run start
# Ctrl+C pour arrêter
```

### Configuration PM2 pour le frontend
```bash
# Ajouter au fichier ecosystem.config.js
nano ../../ecosystem.config.js
```

Ajouter cette configuration:
```javascript
module.exports = {
  apps: [
    {
      // Configuration API (déjà présente)
      name: 'indemnisation-api',
      // ... (configuration précédente)
    },
    {
      // Configuration Frontend
      name: 'indemnisation-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/home/deploy/indemnisation/apps/web',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/deploy/indemnisation/logs/web-error.log',
      out_file: '/home/deploy/indemnisation/logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false
    }
  ]
};
```

```bash
# Redémarrer PM2 avec la nouvelle configuration
pm2 delete all
pm2 start ecosystem.config.js
pm2 save

# Vérifier
pm2 status
```

---

## 7️⃣ CONFIGURATION NGINX

### Configuration pour l'API
```bash
sudo nano /etc/nginx/sites-available/api.indemnisation
```

Contenu:
```nginx
# Upstream pour l'API (load balancing sur 2 instances PM2)
upstream api_backend {
    least_conn;
    server localhost:3001;
}

server {
    listen 80;
    server_name api.indemnisation.votredomaine.com;

    # Redirection vers HTTPS (sera configuré plus tard)
    # return 301 https://$server_name$request_uri;

    # Logs
    access_log /var/log/nginx/api-access.log;
    error_log /var/log/nginx/api-error.log;

    # Limites
    client_max_body_size 20M;

    # Proxy vers l'API
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://api_backend/health;
        access_log off;
    }
}
```

### Configuration pour le Frontend
```bash
sudo nano /etc/nginx/sites-available/web.indemnisation
```

Contenu:
```nginx
# Upstream pour le frontend Next.js
upstream web_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name indemnisation.votredomaine.com www.indemnisation.votredomaine.com;

    # Redirection www vers non-www
    if ($host = www.indemnisation.votredomaine.com) {
        return 301 http://indemnisation.votredomaine.com$request_uri;
    }

    # Logs
    access_log /var/log/nginx/web-access.log;
    error_log /var/log/nginx/web-error.log;

    # Limite de taille upload
    client_max_body_size 20M;

    # Compression gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Static files caching
    location /_next/static/ {
        proxy_pass http://web_backend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images/ {
        proxy_pass http://web_backend;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Proxy vers Next.js
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Activer les sites
```bash
# Créer les liens symboliques
sudo ln -s /etc/nginx/sites-available/api.indemnisation /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/web.indemnisation /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 8️⃣ SSL/HTTPS AVEC LET'S ENCRYPT

### Installer Certbot
```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Obtenir les certificats SSL
```bash
# Pour l'API
sudo certbot --nginx -d api.indemnisation.votredomaine.com

# Pour le frontend
sudo certbot --nginx -d indemnisation.votredomaine.com -d www.indemnisation.votredomaine.com

# Suivre les instructions à l'écran
# Choisir l'option 2 pour rediriger HTTP vers HTTPS
```

### Renouvellement automatique
```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est déjà configuré par Certbot
# Vérifier avec:
sudo systemctl status certbot.timer
```

---

## 9️⃣ CONFIGURATION PM2

### Monitoring PM2
```bash
# Voir les stats en temps réel
pm2 monit

# Voir les logs
pm2 logs

# Voir les logs d'une app spécifique
pm2 logs indemnisation-api
pm2 logs indemnisation-web

# Redémarrer une application
pm2 restart indemnisation-api
pm2 restart indemnisation-web

# Redémarrer toutes les applications
pm2 restart all
```

### PM2 Web Dashboard (optionnel)
```bash
# Installer PM2 Web
pm2 install pm2-logrotate

# Configurer la rotation des logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

---

## 🔟 MONITORING ET LOGS

### Configuration des logs Winston (déjà fait)
Les logs sont configurés dans l'application avec Winston et se trouvent dans:
```
/home/deploy/indemnisation/logs/
├── api-error.log
├── api-out.log
├── web-error.log
├── web-out.log
├── app-YYYY-MM-DD.log (logs applicatifs)
└── error-YYYY-MM-DD.log (erreurs uniquement)
```

### Rotation des logs Nginx
```bash
# Créer la configuration logrotate
sudo nano /etc/logrotate.d/nginx-indemnisation
```

Contenu:
```
/var/log/nginx/api-*.log /var/log/nginx/web-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
```

### Monitoring système avec htop
```bash
# Installer htop
sudo apt install -y htop

# Lancer
htop
```

---

## 1️⃣1️⃣ BACKUPS AUTOMATIQUES

### Script de backup complet
```bash
sudo nano /usr/local/bin/backup-full.sh
```

Contenu:
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/indemnisation"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
APP_DIR="/home/deploy/indemnisation"

mkdir -p $BACKUP_DIR/{database,uploads,logs}

# 1. Backup de la base de données
echo "Backing up database..."
PGPASSWORD='VOTRE_MOT_DE_PASSE' pg_dump -U indemnisation_user -h localhost indemnisation_prod | gzip > $BACKUP_DIR/database/db_${TIMESTAMP}.sql.gz

# 2. Backup des fichiers uploadés
echo "Backing up uploads..."
tar -czf $BACKUP_DIR/uploads/uploads_${TIMESTAMP}.tar.gz -C $APP_DIR uploads/

# 3. Backup des logs (optionnel)
echo "Backing up logs..."
tar -czf $BACKUP_DIR/logs/logs_${TIMESTAMP}.tar.gz -C $APP_DIR logs/

# 4. Nettoyage (garder 30 jours)
find $BACKUP_DIR/database -name "db_*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR/uploads -name "uploads_*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR/logs -name "logs_*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${TIMESTAMP}"
echo "Database: $(du -h $BACKUP_DIR/database/db_${TIMESTAMP}.sql.gz | cut -f1)"
echo "Uploads: $(du -h $BACKUP_DIR/uploads/uploads_${TIMESTAMP}.tar.gz | cut -f1)"
```

```bash
# Rendre exécutable
sudo chmod +x /usr/local/bin/backup-full.sh

# Tester
sudo /usr/local/bin/backup-full.sh

# Ajouter au crontab (tous les jours à 3h du matin)
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/backup-full.sh >> /var/log/full-backup.log 2>&1") | crontab -
```

### Backup vers un stockage externe (recommandé)
```bash
# Installer rclone pour backup vers cloud
curl https://rclone.org/install.sh | sudo bash

# Configurer rclone (suivre les instructions)
rclone config

# Exemple de synchronisation vers cloud
rclone sync /var/backups/indemnisation mon-cloud:backups/indemnisation
```

---

## 1️⃣2️⃣ SÉCURITÉ

### Fail2ban (protection contre brute force)
```bash
# Créer la configuration pour Nginx
sudo nano /etc/fail2ban/jail.local
```

Contenu:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/*error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/*access.log
maxretry = 2
```

```bash
# Redémarrer Fail2ban
sudo systemctl restart fail2ban

# Vérifier le statut
sudo fail2ban-client status
```

### Permissions des fichiers
```bash
# Sécuriser les fichiers sensibles
chmod 600 /home/deploy/indemnisation/apps/api/.env
chmod 600 /home/deploy/indemnisation/apps/web/.env.production.local

# Sécuriser les uploads
chmod 755 /home/deploy/indemnisation/uploads
chown -R deploy:deploy /home/deploy/indemnisation/uploads
```

### Rate Limiting (déjà configuré dans NestJS)
Le rate limiting est configuré dans l'application backend avec `@nestjs/throttler`.

---

## 1️⃣3️⃣ CI/CD AVEC GITHUB ACTIONS

### Créer le fichier de workflow
```bash
# Dans votre repo local
mkdir -p .github/workflows
nano .github/workflows/deploy-production.yml
```

Contenu de `deploy-production.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to VPS
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            # Aller dans le répertoire
            cd /home/deploy/indemnisation

            # Pull les dernières modifications
            git pull origin main

            # Backend
            cd apps/api
            npm install --production=false
            npx prisma generate
            npx prisma migrate deploy
            npm run build

            # Frontend
            cd ../web
            npm install --production=false
            npm run build

            # Redémarrer les applications
            pm2 restart all

            # Vérifier le statut
            pm2 status
```

### Configurer les secrets GitHub
1. Aller dans Settings > Secrets and variables > Actions
2. Ajouter les secrets:
   - `VPS_HOST`: IP de votre VPS
   - `VPS_USERNAME`: `deploy`
   - `VPS_SSH_KEY`: Votre clé SSH privée

### Générer une clé SSH de déploiement
```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@YOUR_VPS_IP

# Copier la clé privée dans les secrets GitHub
cat ~/.ssh/github_deploy
```

---

## 1️⃣4️⃣ TROUBLESHOOTING

### L'API ne répond pas
```bash
# Vérifier le statut PM2
pm2 status

# Voir les logs
pm2 logs indemnisation-api --lines 100

# Vérifier que le port est ouvert
sudo netstat -tulpn | grep 3001

# Redémarrer l'API
pm2 restart indemnisation-api
```

### Le frontend ne charge pas
```bash
# Vérifier PM2
pm2 logs indemnisation-web --lines 100

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Voir les logs Nginx
sudo tail -f /var/log/nginx/web-error.log
```

### Erreurs de base de données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql -d indemnisation_prod

# Vérifier les migrations
cd /home/deploy/indemnisation/apps/api
npx prisma migrate status

# Appliquer les migrations manquantes
npx prisma migrate deploy
```

### Problèmes de mémoire
```bash
# Voir l'utilisation mémoire
free -h
pm2 monit

# Augmenter la limite mémoire PM2
pm2 delete all
# Éditer ecosystem.config.js et augmenter max_memory_restart
pm2 start ecosystem.config.js
```

### Certificat SSL expiré
```bash
# Renouveler manuellement
sudo certbot renew

# Recharger Nginx
sudo systemctl reload nginx
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### Avant le déploiement
- [ ] VPS configuré avec Ubuntu 22.04+
- [ ] Domaines configurés dans le DNS
- [ ] Accès SSH fonctionnel
- [ ] Firewall configuré (UFW)
- [ ] Utilisateur non-root créé

### Services installés
- [ ] Node.js 20 LTS
- [ ] PostgreSQL 15
- [ ] Redis
- [ ] Nginx
- [ ] PM2
- [ ] Certbot

### Configuration
- [ ] Base de données créée
- [ ] Variables d'environnement configurées
- [ ] Fichiers .env sécurisés (chmod 600)
- [ ] PM2 configuré avec ecosystem.config.js
- [ ] Nginx configuré pour API et frontend
- [ ] SSL/HTTPS activé avec Let's Encrypt

### Sécurité
- [ ] Firewall actif (UFW)
- [ ] Fail2ban configuré
- [ ] Backups automatiques configurés
- [ ] Permissions des fichiers vérifiées

### Tests de production
- [ ] API accessible via https://api.indemnisation.votredomaine.com/health
- [ ] Frontend accessible via https://indemnisation.votredomaine.com
- [ ] SSL valide (pas d'erreurs de certificat)
- [ ] Tests de connexion à la base de données
- [ ] Tests d'upload de fichiers
- [ ] Tests de messagerie interne
- [ ] Vérification des logs

### Monitoring
- [ ] PM2 monitoring actif
- [ ] Logs configurés et rotatifs
- [ ] Backups testés et fonctionnels

---

## 📞 SUPPORT ET RESOURCES

### Commandes utiles
```bash
# Redémarrer tous les services
pm2 restart all && sudo systemctl reload nginx

# Voir l'état complet du système
pm2 status && sudo systemctl status nginx && sudo systemctl status postgresql

# Backup manuel immédiat
sudo /usr/local/bin/backup-full.sh

# Nettoyer les anciens logs
pm2 flush

# Mettre à jour le système
sudo apt update && sudo apt upgrade -y
```

### Documentation
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

---

**Félicitations ! Votre plateforme est maintenant déployée en production sur votre VPS ! 🎉**
