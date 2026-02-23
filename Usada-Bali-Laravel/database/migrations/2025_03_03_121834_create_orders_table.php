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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('phone');
            $table->enum('status', ['PENDING', 'FAILED', 'PAID', 'CANCELLED']); // Added CANCELLED status
            $table->float('price');
            $table->float('total'); // Added total field used in controller
            $table->string('url')->nullable();
            $table->string('payment_channel')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->text('address');
            $table->text('address_description')->nullable(); // Made nullable to match validation
            $table->string('city');
            $table->string('postal_code');
            $table->string('country');
            $table->text('products_name')->nullable(); // Added field used in controller
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};