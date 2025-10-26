# Use the official PHP 8.3 image as the base
FROM php:8.3.11-fpm

# Install system dependencies and PHP extensions required for Laravel + SQLite support
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_sqlite \
    opcache \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set the working directory inside the container
WORKDIR /var/www

# Copy the entire Laravel application code into the container
COPY . /var/www

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Ensure correct permissions
RUN chown -R www-data:www-data /var/www

# Switch to the non-privileged user to run the application
USER www-data

# Expose port 8000 (Laravel's built-in server port)
EXPOSE 8000

# Run Laravel's built-in server on 0.0.0.0:8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
