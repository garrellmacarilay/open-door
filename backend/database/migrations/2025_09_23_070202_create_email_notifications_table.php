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
        Schema::create('email_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK → recipient
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('cascade'); // optional link to booking
            $table->string('subject'); // Email subject
            $table->text('message');   // Email body content
            $table->string('recipient_email'); // email address
            $table->enum('type', [
                'booking_approved',
                'booking_declined',
                'booking_cancelled',
                'booking_request',
                'booking_completed',
            ]);
            $table->enum('status', ['pending','sent','failed'])->default('pending'); // delivery status
            $table->timestamp('sent_at')->nullable(); // actual sent time
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_notifications');
    }
};
