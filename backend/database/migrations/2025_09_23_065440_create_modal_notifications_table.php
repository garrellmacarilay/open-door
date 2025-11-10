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
        Schema::create('modal_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade'); // FK
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // FK
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade'); // FK
            $table->enum('type', ['approval','decline','reschedule','cancellation', 'booking_request']);
            $table->text('message');
            $table->enum('status', ['sent','read','archived'])->default('sent');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modal_notifications');
    }
};
