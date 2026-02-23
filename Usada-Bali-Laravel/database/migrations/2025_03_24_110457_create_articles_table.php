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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image_url')->nullable();
            $table->string('icon')->nullable(); // For category icons
            $table->string('category')->nullable(); // Disease category
            $table->text('description')->nullable(); // Short description
            $table->longText('content'); // Full article content
            $table->json('ingredients')->nullable(); // Array of ingredients
            $table->json('benefits')->nullable(); // Array of benefits
            $table->json('preparation_steps')->nullable(); // Array of preparation steps
            $table->string('keywords')->nullable(); // SEO keywords
            $table->string('meta_description')->nullable(); // SEO meta description
            $table->timestamp('published_at')->nullable(); // Publication date
            $table->boolean('is_published')->default(true); // Publication status
            $table->integer('views_count')->default(0); // View counter
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('category');
            $table->index('is_published');
            $table->index('published_at');
            $table->fullText(['title', 'description', 'content']); // For search functionality
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};