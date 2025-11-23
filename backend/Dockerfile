FROM php:8.3.11-fpm

# Install system dependencies for PHP and Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip libsqlite3-dev libonig-dev libzip-dev libpq-dev zip git bash \
    gnupg2 ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libcups2 libdbus-1-3 libdrm2 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libgtk-3-0 libpango-1.0-0 libxshmfence1 libnss3 libxss1 libxkbcommon0 \
    libcurl4 libstdc++6 wget xvfb \
    && docker-php-ext-install -j$(nproc) pdo_mysql pdo_pgsql pdo_sqlite mbstring zip opcache bcmath exif \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www

# Copy composer files first for caching
COPY composer.json composer.lock /var/www/

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Copy the rest of the app
COPY . /var/www

# Run artisan commands
RUN php artisan package:discover

# Ensure storage & cache directories exist
RUN mkdir -p storage bootstrap/cache database \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Install Node.js & Puppeteer for Browsershot
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install puppeteer

USER www-data
EXPOSE ${PORT:-10000}

CMD bash -c "\
    php artisan config:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate:fresh --seed --force && \
    php artisan storage:link && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000} \
"
