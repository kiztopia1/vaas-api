<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agency_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('users')->onDelete('cascade'); // Reference to the agency
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Reference to the user
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agency_user');
    }
};
