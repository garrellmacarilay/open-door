FROM php:8.3.11-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip libsqlite3-dev libonig-dev libzip-dev libpq-dev zip git bash \
    && docker-php-ext-install -j$(nproc) pdo_mysql pdo_pgsql pdo_sqlite mbstring zip opcache bcmath exif \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www

# Copy composer files for caching
COPY composer.json composer.lock /var/www/

# Install dependencies WITHOUT running scripts (artisan doesn’t exist yet)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Copy the rest of the app
COPY . /var/www

# Now run artisan commands
RUN php artisan package:discover

# Ensure storage & cache directories exist
RUN mkdir -p storage bootstrap/cache database \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

USER www-data
EXPOSE ${PORT:-10000}

CMD bash -c "\
    php artisan config:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate:fresh --seed --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000} \
"
