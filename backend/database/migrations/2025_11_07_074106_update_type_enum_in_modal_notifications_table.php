<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       DB::statement("
            ALTER TABLE modal_notifications
            MODIFY COLUMN type ENUM(
                'approval',
                'decline',
                'reschedule',
                'cancellation',
                'booking_request'
            ) NOT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE modal_notifications
            MODIFY COLUMN type ENUM(
                'approval',
                'declined',
                'reschedule',
                'cancellation'
            ) NOT NULL
        ");
    }
};
