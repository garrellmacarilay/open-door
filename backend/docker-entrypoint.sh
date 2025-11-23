#!/bin/bash
set -e

# Run migrations and seed AFTER the database is ready
php artisan migrate:fresh --seed --force || echo "Migrations failed, maybe DB not ready yet"

# Link storage (if not linked)
php artisan storage:link || echo "Storage link failed"

# Clear caches
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Serve the app
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
