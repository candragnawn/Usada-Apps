<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $article = Article::find(21);
    if ($article) {
        echo "ID: " . $article->id . "\n";
        echo "Title (B64): " . base64_encode($article->title) . "\n";
        echo "Image URL (B64): " . base64_encode($article->image_url) . "\n";
        echo "Slug (B64): " . base64_encode($article->slug) . "\n";
    } else {
        echo "Article 21 not found\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
