# Use the official PHP 8.3 image as the base
FROM php:8.3.11-fpm

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_sqlite \
    opcache \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www
COPY . /var/www

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Give write permission to storage & bootstrap/cache
RUN chown -R www-data:www-data /var/www && chmod -R 775 storage bootstrap/cache database

USER www-data

# Expose Render port
EXPOSE 10000

# Run necessary Laravel setup before serving
CMD php artisan key:generate --force && \
    php artisan migrate --force && \
    php artisan config:cache && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
