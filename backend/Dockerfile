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
    bash \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        zip \
        opcache \
        bcmath \
        exif \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ----------------------------
# Set working directory
# ----------------------------
WORKDIR /var/www

# ----------------------------
# Copy application code
# ----------------------------
COPY . /var/www

# Ensure storage and cache directories exist and are writable
RUN mkdir -p storage bootstrap/cache database \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# ----------------------------
# Install Composer
# ----------------------------
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Allow Composer unlimited memory
ENV COMPOSER_MEMORY_LIMIT=-1

# ----------------------------
# Install PHP dependencies
# ----------------------------
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist --no-scripts

# ----------------------------
# Switch to www-data
# ----------------------------
USER www-data

# ----------------------------
# Expose port
# ----------------------------
EXPOSE ${PORT:-10000}

# ----------------------------
# Laravel setup and php-fpm for production
# ----------------------------
CMD bash -c "\
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    echo 'Starting Laravel built-in server...' && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000} \
"
