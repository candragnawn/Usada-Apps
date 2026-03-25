<?php

error_reporting(0);
ini_set('display_errors', 0);

ob_start();

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

ob_clean();

try {
    $article = Article::find(21);
    if ($article) {
        $result = [
            'id' => $article->id,
            'title_b64' => base64_encode($article->title),
            'image_url_b64' => base64_encode($article->image_url),
            'slug_b64' => base64_encode($article->slug),
        ];
        echo json_encode($result);
    } else {
        echo "NOT_FOUND";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}

ob_end_flush();
