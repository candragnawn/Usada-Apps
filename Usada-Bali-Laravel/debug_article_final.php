<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $article = Article::find(21);
    if ($article) {
        $data = [
            'id' => $article->id,
            'title' => [
                'raw' => $article->title,
                'urlencoded' => urlencode($article->title),
                'hex' => bin2hex($article->title)
            ],
            'slug' => urlencode($article->slug),
            'image_url' => [
                'raw' => $article->image_url,
                'urlencoded' => urlencode($article->image_url),
                'hex' => bin2hex($article->image_url)
            ],
            'description' => urlencode($article->description)
        ];
        
        echo json_encode($data, JSON_PRETTY_PRINT);
    } else {
        echo "Article 21 not found\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
