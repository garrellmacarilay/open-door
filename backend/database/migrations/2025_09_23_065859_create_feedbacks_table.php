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
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade'); // FK
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // FK
            $table->foreignId('office_id')->constrained('offices')->onDelete('cascade'); // FK
            $table->foreignId('staff_id')->constrained('staffs')->onDelete('cascade'); // FK
            $table->tinyInteger('rating'); // 1-5 stars
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
