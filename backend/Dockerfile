FROM php:8.3.11-fpm

# ─────────────────────────────
# System Dependencies
# ─────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip libsqlite3-dev libonig-dev libzip-dev libpq-dev zip git bash \
    gnupg2 ca-certificates fontconfig fonts-dejavu-core \
    # Essential Fonts for PDF rendering (Prevents "square" characters)
    fonts-liberation fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    # Image Manipulation Dependencies
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    # Puppeteer/Chrome dependencies
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libdrm2 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0 \
    libpango-1.0-0 libxshmfence1 libnss3 libxss1 libxkbcommon0 libcurl4 \
    libstdc++6 wget xvfb libglu1 \
    # Configure extensions
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    # Install PHP Extensions
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql pdo_pgsql pdo_sqlite mbstring zip opcache bcmath exif pcntl gd \
    && apt-get autoremove -y && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ─────────────────────────────
# Working Directory
# ─────────────────────────────
WORKDIR /var/www

# ─────────────────────────────
# Composer Install
# ─────────────────────────────
COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# ─────────────────────────────
# Copy Application
# ─────────────────────────────
COPY . .

RUN composer dump-autoload --optimize

# ─────────────────────────────
# Permissions & Directory Setup
# ─────────────────────────────
RUN mkdir -p storage/app/reports bootstrap/cache public/storage \
    /var/www/.cache/puppeteer \
    /var/www/.npm \
    /var/www/.npm-global

# Grant ownership to www-data
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public

# ─────────────────────────────
# Node.js & Puppeteer
# ─────────────────────────────
# 1. Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 2. Configure Node Environment
ENV PUPPETEER_CACHE_DIR=/var/www/.cache/puppeteer
ENV PATH="$PATH:/var/www/node_modules/.bin"

# 3. Install Puppeteer and Chrome
# We use a fixed version to ensure the path remains predictable
RUN npm install puppeteer@22.6.0 --unsafe-perm

# 4. Install the browser and create the symlink
# This logic manually finds the binary to avoid the npx variable capture bug
RUN npx puppeteer browsers install chrome && \
    CHROME_PATH=$(find /var/www/.cache/puppeteer -name chrome -type f -executable | head -n 1) && \
    if [ -z "$CHROME_PATH" ]; then echo "Chrome not found"; exit 1; fi && \
    ln -s "$CHROME_PATH" /usr/bin/google-chrome && \
    chmod +x /usr/bin/google-chrome
# ─────────────────────────────
# Entrypoint Script
# ─────────────────────────────
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ─────────────────────────────
# Runtime User & Port
# ─────────────────────────────
# Switch to www-data for runtime safety
USER www-data

EXPOSE ${PORT:-10000}

CMD ["docker-entrypoint.sh"]
