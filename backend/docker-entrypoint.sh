#!/bin/bash
set -e

echo "[entrypoint] starting container entrypoint"

# Run migrations and seed AFTER the database is ready
echo "[entrypoint] running migrations (may fail if DB not ready)"
php artisan migrate:fresh --seed --force || echo "[entrypoint] Migrations failed, maybe DB not ready yet"

# Link storage (if not linked)
echo "[entrypoint] ensuring storage symlink exists"
if php artisan storage:link 2>/dev/null; then
	echo "[entrypoint] storage:link created or already exists"
else
	echo "[entrypoint] storage:link command failed or symlink exists"
fi

# Log storage status for debugging
echo "[entrypoint] public/storage symlink info:"
ls -la public | grep storage || true
echo "[entrypoint] first 20 items in storage/app/public (if any):"
ls -la storage/app/public || true

# Clear caches
echo "[entrypoint] clearing and warming caches"
php artisan config:clear || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "[entrypoint] starting Laravel dev server"
# Serve the app
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
