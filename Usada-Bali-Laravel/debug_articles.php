<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $articles = Article::published()->take(5)->get();
    echo "Count: " . $articles->count() . "\n";
    foreach ($articles as $article) {
        echo "ID: " . $article->id . " - Title: " . $article->title . "\n";
        echo "Image URL: [" . $article->image_url . "]\n";
    }
    
    $json = json_encode(['data' => $articles]);
    if ($json === false) {
        echo "JSON Encode Error: " . json_last_error_msg() . "\n";
    } else {
        echo "JSON Length: " . strlen($json) . "\n";
        echo "JSON Preview: " . substr($json, 0, 500) . "...\n";
        echo "JSON End: " . substr($json, -100) . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
