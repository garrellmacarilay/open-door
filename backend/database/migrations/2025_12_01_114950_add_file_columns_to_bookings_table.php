<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('uploaded_file_name')->nullable();
            $table->string('uploaded_file_mime')->nullable();
            $table->bigInteger('uploaded_file_size')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['uploaded_file_mime', 'uploaded_file_name', 'uploaded_file_size']);
        });
    }
};
