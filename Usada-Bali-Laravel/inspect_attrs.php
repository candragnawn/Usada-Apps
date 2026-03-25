<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Article;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $article = Article::find(21);
    if ($article) {
        $attrs = $article->getAttributes();
        echo "ATTRS_COUNT: " . count($attrs) . "\n";
        foreach ($attrs as $k => $v) {
            echo "KEY: $k | VAL_TYPE: " . gettype($v) . " | VAL_LEN: " . (is_string($v) ? strlen($v) : 'N/A') . "\n";
        }
    } else {
        echo "NOT_FOUND\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
