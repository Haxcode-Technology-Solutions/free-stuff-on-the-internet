# FMHY

![FMHY Banner](https://github.com/user-attachments/assets/0d43950d-a56f-437f-b9f6-afaed2313370)

<p align="center"> <b> The largest collection of free stuff on the internet! </b> </p>

## 📖 Wiki

- Website: [fmhy.net](https://fmhy.net)
- News & Monthly Updates: [fmhy.net/posts](https://fmhy.net/posts)
- Backups, Markdown, JSON API: [github.com/fmhy/FMHY/wiki/Backups](https://github.com/fmhy/FMHY/wiki/Backups)
- Neither the site nor GitHub host any files

## 🗺️ Emoji Legend

* 🌐 - **3rd Party Indexes**
* ↪️ - **Storage Page Links**
* ⭐ - **Community Recommendations**

## 📝 Contribute

We invite you to contribute and help improve the wiki! 💙

Here are a few ways you can get involved:

* Anyone can suggest changes or corrections to the wiki. Please read our [contribution guide](https://fmhy.net/other/contributing) before trying to add or remove anything.
* If you're adding a new site, please [search](https://api.fmhy.net/single-page) (`Ctrl + F`) first to make sure we don't already have it.
* Approved changes will be applied to the [site](https://fmhy.net) and all [🔒 backups](https://github.com/fmhy/FMHY/wiki/Backups).
* You can send us stuff directly via [💬 Discord](https://github.com/fmhy/FMHY/wiki/FMHY-Discord).
* To help us find new sites, check out the lists of links in [site hunting](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/find-new-sites/).

## 🔔 Follow

<p>
  <a href="https://github.com/fmhy/FMHY/wiki/FMHY-Discord"><img width="30px" src="./assets/discord.svg" alt="Discord"></a>&nbsp;&nbsp;<a href="https://github.com/fmhy"><img width="30px" src="./assets/github.svg" alt="GitHub"></a>
</p>

---

## Haxcode Technology Solutions Platform

> Curated Digital Resources Powered by FMHY

A production-ready full-stack web application built with **React 18 + Vite** (frontend) and **PHP 8 + MySQL** (backend REST API). Designed for shared hosting deployment on Hostinger.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | PHP 8+, MySQL, PDO, JWT Auth |
| Email | PHPMailer / Hostinger SMTP |
| Hosting | Shared hosting (Hostinger compatible) |

### Features

- Resource directory with categories, search, filters, and sorting
- JWT authentication with email verification
- Comment system with nested replies and moderation
- Bookmark system for logged-in users
- Newsletter with double opt-in (daily/weekly/trending)
- FMHY data sync via cron
- Admin panel (resource CRUD, comment moderation, subscriber export)
- Dark/light theme, mobile-first responsive design
- SEO (meta tags, OpenGraph, JSON-LD, sitemap.xml)

### Project Structure

```
frontend/                 React SPA
├── src/
│   ├── components/       Reusable UI components
│   ├── pages/            Route pages
│   ├── services/         API service layer
│   ├── context/          Auth & Theme providers
│   ├── hooks/            Custom React hooks
│   └── utils/            Helpers & formatters
│
backend/                  PHP REST API
├── config/               Database, CORS, app settings
├── controllers/          Request handlers
├── models/               Database models (PDO)
├── middleware/            Auth & rate limiting
├── routes/               Router & route definitions
├── helpers/              JWT, Mailer, Validator, Response
├── migrations/           SQL schema
└── cron/                 Scheduled jobs
```

---

## Installation, Configuration & Setup on Shared Hosting

### Prerequisites

- Node.js 18+ (for building the frontend locally)
- A shared hosting account with PHP 8.0+ and MySQL 8.0+
- Access to hosting control panel (hPanel, cPanel, etc.)
- A domain name pointed to your hosting

### Step 1: Clone the Repository

```bash
git clone https://github.com/Haxcode-Technology-Solutions/free-stuff-on-the-internet.git
cd free-stuff-on-the-internet
```

### Step 2: Create the MySQL Database

1. Log into your hosting control panel (e.g. Hostinger hPanel)
2. Navigate to **Databases** > **MySQL Databases**
3. Create a new database named `haxcode_fmhy`
4. Create a database user and grant it **all privileges** on `haxcode_fmhy`
5. Open **phpMyAdmin** and select your new database
6. Go to the **Import** tab and upload `backend/migrations/schema.sql`
7. Click **Go** to run the import — this creates all tables and inserts sample data

### Step 3: Configure the Backend

1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your actual credentials:
   ```ini
   # Database (use the credentials from Step 2)
   DB_HOST=localhost
   DB_NAME=haxcode_fmhy
   DB_USER=your_db_user
   DB_PASS=your_db_password

   # Application URLs (use your actual domain)
   APP_URL=https://yourdomain.com
   FRONTEND_URL=https://yourdomain.com

   # JWT Secret (generate a random 64+ character string)
   # You can generate one with: openssl rand -hex 32
   JWT_SECRET=your-64-char-random-secret-string-here

   # SMTP — Hostinger Email
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASS=your-email-password
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   SMTP_FROM_NAME=Haxcode Technology Solutions
   SMTP_ENCRYPTION=ssl

   # reCAPTCHA (optional, get keys from https://www.google.com/recaptcha)
   RECAPTCHA_SITE_KEY=
   RECAPTCHA_SECRET_KEY=
   ```

### Step 4: Set Up Hostinger SMTP Email

1. In hPanel, go to **Emails** > **Email Accounts**
2. Create a new email account (e.g. `noreply@yourdomain.com`)
3. Note the password — use it as `SMTP_PASS` in your `.env`
4. SMTP settings for Hostinger:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - Encryption: `SSL`
   - Authentication: Required

### Step 5: Build the Frontend

On your **local machine** (Node.js required only for building):

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_URL=https://yourdomain.com/api

# Build for production
npm run build
```

This generates a `frontend/dist/` folder with optimized static files. No Node.js is needed on the server.

### Step 6: Upload Files to Shared Hosting

Use **File Manager** in hPanel or an FTP client (FileZilla, WinSCP):

```
Your Server (public_html/)
├── index.html              ← from frontend/dist/
├── assets/                 ← from frontend/dist/assets/
├── favicon.svg             ← from frontend/dist/
├── robots.txt              ← from frontend/public/
├── .htaccess               ← from frontend/public/.htaccess
│
└── api/                    ← entire backend/ folder contents
    ├── index.php
    ├── .htaccess
    ├── .env                ← configured in Step 3
    ├── config/
    ├── controllers/
    ├── models/
    ├── middleware/
    ├── routes/
    ├── helpers/
    ├── migrations/
    └── cron/
```

**Upload order:**
1. Upload all contents of `frontend/dist/` into `public_html/`
2. Upload `frontend/public/.htaccess` to `public_html/.htaccess`
3. Upload `frontend/public/robots.txt` to `public_html/robots.txt`
4. Create `public_html/api/` directory
5. Upload all contents of `backend/` into `public_html/api/`
6. Make sure `public_html/api/.env` has your production credentials

### Step 7: Verify .htaccess Files

Ensure both `.htaccess` files are uploaded (they may be hidden by default):

**`public_html/.htaccess`** — Routes all non-file requests to `index.html` for React Router:
```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^api(/.*)?$ api/$1 [L]
RewriteRule ^ index.html [L]
```

**`public_html/api/.htaccess`** — Routes all API requests to `index.php`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### Step 8: Set Up Cron Jobs

In hPanel, go to **Advanced** > **Cron Jobs** and add:

| Schedule | Command |
|----------|---------|
| Every 6 hours | `/usr/bin/php /home/YOUR_USER/public_html/api/cron/sync_fmhy.php` |
| Daily at 8 AM | `/usr/bin/php /home/YOUR_USER/public_html/api/cron/send_newsletter.php daily` |
| Mondays at 8 AM | `/usr/bin/php /home/YOUR_USER/public_html/api/cron/send_newsletter.php weekly` |
| Wed & Sat at 8 AM | `/usr/bin/php /home/YOUR_USER/public_html/api/cron/send_newsletter.php trending` |

Replace `YOUR_USER` with your actual hosting username (visible in hPanel under **Account Details**).

### Step 9: Post-Deployment Security Checklist

After deployment, complete these steps immediately:

- [ ] **Change the default admin password** — Log in with `admin@haxcode.com` / `admin123` and update via the database or profile page
- [ ] **Verify JWT_SECRET is set** — Must be a random 64+ character string
- [ ] **Confirm `.env` is protected** — Visit `https://yourdomain.com/api/.env` in a browser and verify it returns 403/404 (the `.htaccess` should block it)
- [ ] **Enable HTTPS** — In hPanel, go to **Security** > **SSL** and enable the free SSL certificate
- [ ] **Force HTTPS redirect** — Enable in hPanel or add to `.htaccess`
- [ ] **Test email sending** — Register a new account and confirm the verification email arrives
- [ ] **Test rate limiting** — Rapidly hit the login endpoint and confirm 429 responses after the limit
- [ ] **Set up reCAPTCHA** — Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha) and add to `.env`
- [ ] **Verify CORS origins** — Edit `backend/config/cors.php` to only allow your domain

### Step 10: Test the Application

1. Visit `https://yourdomain.com` — you should see the homepage
2. Click through categories, search for resources, view resource pages
3. Register a new account — check email for verification link
4. After verifying, log in and test commenting and bookmarking
5. Visit `https://yourdomain.com/admin` with admin credentials
6. In admin panel, click **Sync FMHY Data** to pull resources
7. Verify newsletter subscription by entering an email in the footer form

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page / 404 on routes | Ensure `public_html/.htaccess` is uploaded and `mod_rewrite` is enabled |
| API returns 500 error | Check `backend/.env` database credentials; view PHP error logs in hPanel |
| Emails not sending | Verify SMTP credentials in `.env`; check spam folder; ensure email account exists in hPanel |
| CORS errors in browser | Edit `backend/config/cors.php` and add your domain to the allowed origins array |
| FMHY sync fails | Check that `allow_url_fopen` is enabled in PHP settings (hPanel > PHP Configuration) |
| CSS/JS not loading | Ensure `frontend/dist/assets/` was uploaded to `public_html/assets/` |

### REST API Reference

Full API documentation is available in [DEPLOYMENT.md](../DEPLOYMENT.md).

### Disclaimer

> This platform utilizes FMHY services and backend data. We do not host content directly.
