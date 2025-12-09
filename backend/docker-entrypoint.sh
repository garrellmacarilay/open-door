#!/bin/bash
set -e

echo "[entrypoint] starting container entrypoint"

# ─────────────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────────────
# WARNING: This wipes the database on every restart/deploy
echo "[entrypoint] Wiping database and running seeds..."
php artisan migrate --force || echo "[entrypoint] Migrations/Seeding failed"

# ─────────────────────────────────────────────────────
# Storage Linking
# ─────────────────────────────────────────────────────
echo "[entrypoint] ensuring storage symlink exists"
if php artisan storage:link 2>/dev/null; then
    echo "[entrypoint] storage:link created or already exists"
else
    echo "[entrypoint] storage:link command failed or symlink exists"
fi

# ─────────────────────────────────────────────────────
# Cache Management
# ─────────────────────────────────────────────────────
echo "[entrypoint] clearing and warming caches"
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Ideally, in production, you want to cache config/routes,
# but only if your ENV vars are completely set before this runs.
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# ───────────────────────────────────────────────
# Start Queue Worker (Background)
# ───────────────────────────────────────────────

if [ "$QUEUE_CONNECTION" = "database" ]; then
    echo "[entrypoint] Starting Laravel queue worker in background"
    php artisan queue:work --sleep=3 --tries=3 &
fi

# ─────────────────────────────────────────────────────
# Start Server
# ─────────────────────────────────────────────────────
echo "[entrypoint] starting Laravel server"
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
