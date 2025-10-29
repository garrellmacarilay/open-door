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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); // PK
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // FK
            $table->foreignId('office_id')->constrained('offices')->onDelete('cascade'); // FK
            $table->foreignId('staff_id')->nullable()->constrained('staffs')->onDelete('set null'); // FK
            $table->string('service_type');
            $table->dateTime('consultation_date');
            $table->text('concern_description');
            $table->enum('status', ['pending','approved','cancelled','rescheduled','completed'])->default('pending');
            $table->string('group_members')->nullable();
            $table->string('uploaded_file_url')->nullable();
            $table->string('reference_code')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookingss');
    }
};
