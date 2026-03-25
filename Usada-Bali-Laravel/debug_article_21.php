<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function check_utf8($str) {
    return mb_check_encoding($str, 'UTF-8');
}

try {
    $article = Article::find(21);
    if (!$article) {
        echo "Article 21 not found. Trying first article.\n";
        $article = Article::first();
    }
    
    if ($article) {
        echo "ID: " . $article->id . "\n";
        echo "Title: " . $article->title . " (UTF8: " . (check_utf8($article->title) ? "YES" : "NO") . ")\n";
        echo "Slug: " . $article->slug . " (UTF8: " . (check_utf8($article->slug) ? "YES" : "NO") . ")\n";
        echo "Image URL: [" . $article->image_url . "] (UTF8: " . (check_utf8($article->image_url) ? "YES" : "NO") . ")\n";
        
        $json = json_encode($article);
        if ($json === false) {
            echo "JSON Encode Error: " . json_last_error_msg() . "\n";
        } else {
            echo "JSON Length: " . strlen($json) . "\n";
            // Check for hidden characters in image_url
            echo "Image URL Hex: " . bin2hex($article->image_url) . "\n";
        }
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
