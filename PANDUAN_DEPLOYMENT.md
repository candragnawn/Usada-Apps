# Panduan Deployment Aplikasi USADA (Frontend + Backend)

## Daftar Isi
1. [Deploy Frontend (APK dengan Expo)](#deploy-frontend)
2. [Deploy Backend (Laravel)](#deploy-backend)
3. [Testing & Troubleshooting](#testing--troubleshooting)

---

## DEPLOY FRONTEND (APK dengan Expo)

### Persyaratan
- Node.js v18+ dan npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Akun Expo (daftar di https://expo.dev)
- (Opsional) Android SDK atau local machine builder

### Opsi 1: Menggunakan EAS (Recommended - Cloud Build)

**Kelebihan:**
- Tidak perlu Android SDK di local machine
- Build di cloud server (lebih cepat)
- Signing otomatis untuk production

**Langkah:**

1. **Login ke Expo/EAS:**
```bash
cd c:\Usada\ Apps\FE\AwesomeProject
eas login
```

2. **Configure EAS untuk Android:**
```bash
eas build:configure
```
(Pilih Android, dan ikuti wizard)

3. **Build APK untuk Testing (Preview):**
```bash
eas build --platform android --profile preview
```
Hasilnya akan berupa `.apk` file yang bisa langsung diinstall.

4. **Build APK untuk Production:**
```bash
eas build --platform android --profile production
```

5. **Tunggu proses selesai:**
- Proses bisa memakan waktu 10-30 menit
- Anda akan mendapat link download APK via email atau di dashboard Expo
- APK siap untuk di-install di Android device atau upload ke Play Store

### Opsi 2: Build Lokal (Jika ingin kontrol penuh)

**Persyaratan tambahan:**
- Android SDK/Android Studio
- JDK 11+

**Langkah:**

1. **Install dependencies:**
```bash
cd c:\Usada\ Apps\FE\AwesomeProject
npm install
# atau jika pakai bun
bun install
```

2. **Build APK lokal:**
```bash
expo build:android --type apk
# atau
eas build --platform android --local
```

3. **Hasilnya:**
- APK akan tersimpan di folder `dist/` atau lokasi yang ditunjukkan console

---

## DEPLOY BACKEND (Laravel)

### Opsi 1: Deploy ke Server Shared Hosting (Recommended untuk awal)

**Persyaratan:**
- Shared hosting dengan PHP 8.2+
- MySQL/MariaDB support
- SSH access (opsional tapi recommended)
- FTP client (FileZilla, WinSCP, dll)

**Langkah:**

1. **Prepare Laravel untuk Production:**

```bash
cd c:\Usada\ Apps\Usada-Bali-Laravel

# Install dependencies
composer install --no-dev --optimize-autoloader

# Generate environment file
cp .env.example .env
# Edit .env dengan konfigurasi database dan aplikasi

# Generate app key
php artisan key:generate

# Build frontend assets (jika ada)
npm run build
```

2. **Upload ke Server:**

Gunakan FTP/SFTP untuk upload:
- File source code: `/` (root project)
- Database: buat database baru di hosting
- Public folder: pointing ke `public/` directory

Struktur di server:
```
public_html/
├── public/          (DocumentRoot - pointing ke folder ini)
├── app/
├── config/
├── database/
├── routes/
├── storage/
├── vendor/
├── .env             (jangan lupa upload)
└── ... file lainnya
```

3. **Setup di Server (via SSH/Console):**

```bash
# Navigate ke project
cd /home/username/public_html

# Run migrations
php artisan migrate --force

# Seed database (opsional)
php artisan db:seed

# Clear cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage bootstrap/cache
```

4. **Konfigurasi `.env` di server:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_DATABASE=usada_bali
DB_USERNAME=dbuser
DB_PASSWORD=dbpassword

MAIL_FROM_ADDRESS=noreply@yourdomain.com
# Konfigurasi lainnya
```

5. **Setup Cron untuk Queue (opsional):**
```bash
# Tambah ke crontab:
* * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1
```

---

### Opsi 2: Deploy ke VPS (DigitalOcean, Linode, dll) - Lebih Kontrol

**Langkah cepat:**

1. **SSH ke server:**
```bash
ssh root@your_vps_ip
```

2. **Install requirements:**
```bash
apt update && apt upgrade -y
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl composer nginx
```

3. **Setup repository:**
```bash
cd /var/www
git clone https://github.com/yourusername/usada-bali-laravel.git usada
cd usada
composer install --no-dev
```

4. **Setup environment & database:**
```bash
cp .env.example .env
php artisan key:generate

# Setup MySQL
mysql -u root -p
CREATE DATABASE usada_bali;
CREATE USER 'usada_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON usada_bali.* TO 'usada_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
php artisan migrate
```

5. **Setup Nginx:**
```bash
# Buat config file
nano /etc/nginx/sites-available/usada

# Isi config:
# (Lihat template di bawah)

# Enable site
ln -s /etc/nginx/sites-available/usada /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**Template Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/usada/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

6. **Setup SSL dengan Let's Encrypt:**
```bash
apt install certbot python3-certbot-nginx -y
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
# Update Nginx config untuk SSL
systemctl restart nginx
```

---

### Opsi 3: Docker Deployment (Paling Modern)

**Buat Dockerfile:**

```dockerfile
FROM php:8.2-fpm

# Install extensions
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libjpeg-dev libfreetype6-dev \
    mariadb-client composer nodejs npm

RUN docker-php-ext-install pdo_mysql gd

WORKDIR /app

# Copy project
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm ci && npm run build

# Permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

CMD ["php-fpm"]
```

**docker-compose.yml:**
```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "9000:9000"
    environment:
      - DB_HOST=db
      - DB_USER=usada
      - DB_PASSWORD=password
      - DB_DATABASE=usada_bali

  db:
    image: mariadb:latest
    environment:
      - MYSQL_ROOT_PASSWORD=rootpass
      - MYSQL_DATABASE=usada_bali
      - MYSQL_USER=usada
      - MYSQL_PASSWORD=password
    ports:
      - "3306:3306"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

Deploy:
```bash
docker-compose up -d
docker-compose exec app php artisan migrate
```

---

## MENGHUBUNGKAN FRONTEND KE BACKEND

Setelah backend sudah live, update URL API di frontend.

**Update `.env` atau config di frontend:**

[FE/AwesomeProject/](FE/AwesomeProject/)

Cari file yang menggunakan API base URL dan update:
```javascript
// Contoh di services/api.ts atau sejenisnya
const API_BASE_URL = 'https://yourdomain.com/api';
```

---

## TESTING & TROUBLESHOOTING

### Test Frontend APK
```bash
# Install APK ke Android device
adb install path/to/app-release.apk

# Atau cukup double-click APK jika sudah connect ke device
```

### Test Backend API
```bash
# Test endpoint
curl https://yourdomain.com/api/products

# Atau gunakan Postman/Insomnia
GET https://yourdomain.com/api/products
```

### Common Issues

**1. APK Error "App not installed"**
- Pastikan Android version kompatibel (min API 21+)
- Coba uninstall versi lama terlebih dahulu

**2. Backend error "Connection refused"**
- Pastikan database sudah running
- Check `.env` database configuration
- Run `php artisan migrate`

**3. CORS Error di frontend**
- Update `config/cors.php` di Laravel:
```php
'allowed_origins' => ['*'], // Atau specific domain
```

**4. Storage permission error**
- Run: `chmod -R 777 storage bootstrap/cache`

**5. Blank page di browser**
- Check Laravel logs: `storage/logs/laravel.log`

---

## CHECKLIST DEPLOYMENT

### Frontend (APK)
- [ ] Node dependencies install (`npm/bun install`)
- [ ] Environment variables dikonfigurasi
- [ ] API_URL pointing ke backend yang benar
- [ ] Build lokal test (`npm run android` untuk local build)
- [ ] EAS build berhasil, APK downloaded
- [ ] APK tested di Android device

### Backend (Laravel)
- [ ] Composer dependencies install
- [ ] `.env` dikonfigurasi (DB, mail, etc)
- [ ] Database created & migrated
- [ ] Storage permissions set
- [ ] Test endpoint via curl/Postman
- [ ] SSL certificate installed (untuk production)
- [ ] Backup database reguler dijadwalkan
- [ ] Error logs di-monitor

---

## Update & Maintenance

### Untuk Frontend:
```bash
# Setiap ada update
git pull
npm install
# Build versi baru
eas build --platform android --profile production
```

### Untuk Backend:
```bash
# Pull changes
git pull
composer install

# Jika ada migrasi baru
php artisan migrate

# Clear caches
php artisan config:cache
php artisan route:cache
```

---

**Perlu bantuan lebih lanjut?** Hubungi tim development atau cek dokumentasi:
- Expo: https://docs.expo.dev/
- Laravel: https://laravel.com/docs/
- EAS: https://docs.expo.dev/build/introduction/
