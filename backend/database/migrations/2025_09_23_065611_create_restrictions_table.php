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
        Schema::create('restrictions', function (Blueprint $table) {
            $table->id(); 
            $table->enum('target_type', ['student','office']);
            $table->unsignedBigInteger('target_id'); // points to students or offices
            $table->text('reason');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['active','expired'])->default('active');
            $table->foreignId('created_by')->constrained('admins')->onDelete('cascade'); // FK
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restrictions');
    }
};
