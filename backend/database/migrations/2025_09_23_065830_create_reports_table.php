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
        Schema::create('reports', function (Blueprint $table) {
            $table->id(); 
            $table->string('month_year'); // e.g., '2025-09'
            $table->integer('total_consultations');
            $table->integer('approved_count');
            $table->integer('cancelled_count');
            $table->integer('rescheduled_count');
            $table->string('top_office')->nullable();
            $table->foreignId('generated_by')->constrained('admins')->onDelete('cascade'); // FK
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
