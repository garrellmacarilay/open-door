# ----------------------------
# Base image
# ----------------------------
FROM php:8.3.11-fpm

# ----------------------------
# System dependencies
# ----------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    libsqlite3-dev \
    libonig-dev \
    libzip-dev \
    libpq-dev \
    zip \
    git \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        zip \
        opcache \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ----------------------------
# Set working directory
# ----------------------------
WORKDIR /var/www

# Copy application code
COPY . /var/www

# ----------------------------
# Install Composer
# ----------------------------
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# ----------------------------
# Set permissions
# ----------------------------
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache database

USER www-data

# ----------------------------
# Expose Render port
# ----------------------------
EXPOSE ${PORT:-10000}

# ----------------------------
# Laravel setup and serve
# ----------------------------
# Using CMD instead of RUN so these commands execute at container start
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
