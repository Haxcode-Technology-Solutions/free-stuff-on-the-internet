# Haxcode Technology Solutions - Deployment Guide

## Architecture Overview

```
public_html/              ← React built files (from frontend/dist/)
├── index.html
├── assets/
├── .htaccess             ← SPA routing
├── robots.txt
└── api/                  ← PHP backend
    ├── index.php
    ├── .htaccess
    ├── .env
    ├── config/
    ├── controllers/
    ├── models/
    ├── middleware/
    ├── routes/
    ├── helpers/
    └── cron/
```

## Step 1: Database Setup

1. Log into Hostinger hPanel → Databases → MySQL
2. Create database: `haxcode_fmhy`
3. Create database user with full privileges
4. Import `backend/migrations/schema.sql` via phpMyAdmin

## Step 2: Backend Deployment

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your credentials:
   ```
   DB_HOST=localhost
   DB_NAME=haxcode_fmhy
   DB_USER=your_db_user
   DB_PASS=your_db_password
   APP_URL=https://yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   JWT_SECRET=<generate-64-char-random-string>
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASS=your-email-password
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```
3. Upload entire `backend/` contents to `public_html/api/`
4. Ensure `.htaccess` is uploaded

## Step 3: Frontend Build & Deploy

```bash
cd frontend
npm install
npm run build
```

1. Upload contents of `frontend/dist/` to `public_html/`
2. Upload `frontend/public/.htaccess` to `public_html/.htaccess`
3. Upload `robots.txt` to `public_html/`

## Step 4: SMTP Configuration

1. In Hostinger hPanel → Emails → Create email account
2. Use those credentials in `backend/.env`
3. SMTP Settings:
   - Host: `smtp.hostinger.com`
   - Port: `465` (SSL)
   - Encryption: `ssl`

## Step 5: Cron Jobs

In Hostinger hPanel → Cron Jobs, add:

```
# FMHY data sync (every 6 hours)
0 */6 * * * /usr/bin/php /home/username/public_html/api/cron/sync_fmhy.php

# Daily newsletter
0 8 * * * /usr/bin/php /home/username/public_html/api/cron/send_newsletter.php daily

# Weekly newsletter (Monday)
0 8 * * 1 /usr/bin/php /home/username/public_html/api/cron/send_newsletter.php weekly

# Trending newsletter (Wed & Sat)
0 8 * * 3,6 /usr/bin/php /home/username/public_html/api/cron/send_newsletter.php trending
```

## Step 6: Security Checklist

- [ ] Change default admin password (admin@haxcode.com / admin123)
- [ ] Set a strong JWT_SECRET (64+ random chars)
- [ ] Ensure `.env` file is not publicly accessible
- [ ] Enable HTTPS on your domain
- [ ] Set up reCAPTCHA keys for forms
- [ ] Review CORS origins in `config/cors.php`
- [ ] Test rate limiting is working
- [ ] Disable PHP error display in production

## REST API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List resources (paginated, filterable) |
| GET | `/api/resources/search?q=term` | Full-text search |
| GET | `/api/resources/{slug}` | View resource |
| GET | `/api/resources/{slug}/related` | Related resources |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/{slug}/resources` | Category resources |
| GET | `/api/resources/{id}/comments` | Resource comments |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/verify-email?token=X` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/me` | Get current user (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |

### Protected (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resources/{id}/comments` | Add comment |
| DELETE | `/api/comments/{id}` | Delete own comment |
| GET | `/api/bookmarks` | List bookmarks |
| POST | `/api/bookmarks/{resourceId}` | Toggle bookmark |
| GET | `/api/bookmarks/{resourceId}/check` | Check if bookmarked |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| POST | `/api/admin/resources` | Create resource |
| PUT | `/api/admin/resources/{id}` | Update resource |
| DELETE | `/api/admin/resources/{id}` | Delete resource |
| GET | `/api/admin/comments` | All comments |
| PUT | `/api/admin/comments/{id}` | Moderate comment |
| GET | `/api/admin/subscribers` | List subscribers |
| GET | `/api/admin/subscribers/export` | Export CSV |
| POST | `/api/admin/sync-fmhy` | Trigger FMHY sync |

## Future-Ready Structure

The codebase is structured to support:
- Upvote system (add `votes` table)
- User profiles (extend `users` table)
- Bookmark folders (add `bookmark_folders` table)
- PWA capability (add service worker)
- API versioning (prefix routes with `/v1`)
- Monetization modules (add `subscriptions` table)
