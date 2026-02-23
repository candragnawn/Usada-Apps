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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('payment_method'); // VIRTUAL_ACCOUNT, EWALLET, CREDIT_CARD, QR_CODE
            $table->string('payment_channel'); // BCA, BNI, DANA, OVO, GOPAY, etc.
            $table->decimal('amount', 12, 2);
            $table->string('xendit_id')->unique();
            $table->enum('status', ['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED'])->default('PENDING');
            $table->string('payment_url')->nullable();
            $table->string('payment_code')->nullable(); // Virtual Account number
            $table->text('qr_code')->nullable(); // QR code string
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('callback_data')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
