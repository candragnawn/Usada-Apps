<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables;
use Illuminate\Foundation\Bootstrap\LoadConfiguration;
use Illuminate\Foundation\Bootstrap\RegisterFacades;

(new LoadEnvironmentVariables())->bootstrap($app);
(new LoadConfiguration())->bootstrap($app);
(new RegisterFacades())->bootstrap($app);

// Get the list of providers by actually registering them once and looking at $app->getLoadedProviders()
// or just getting the default list from the application
$providers = [
    \Illuminate\Auth\AuthServiceProvider::class,
    \Illuminate\Cache\CacheServiceProvider::class,
    \Illuminate\Database\DatabaseServiceProvider::class,
    \Illuminate\Encryption\EncryptionServiceProvider::class,
    \Illuminate\Filesystem\FilesystemServiceProvider::class,
    \Illuminate\Foundation\Providers\FormRequestServiceProvider::class,
    \Illuminate\Foundation\Providers\FoundationServiceProvider::class,
    \Illuminate\Hashing\HashServiceProvider::class,
    \Illuminate\Pagination\PaginationServiceProvider::class,
    \Illuminate\Pipeline\PipelineServiceProvider::class,
    \Illuminate\Queue\QueueServiceProvider::class,
    \Illuminate\Redis\RedisServiceProvider::class,
    \Illuminate\Session\SessionServiceProvider::class,
    \Illuminate\Translation\TranslationServiceProvider::class,
    \Illuminate\Validation\ValidationServiceProvider::class,
    \Illuminate\View\ViewServiceProvider::class,
];

// Add app-specific ones
if (file_exists(__DIR__.'/bootstrap/providers.php')) {
    $extra = require __DIR__.'/bootstrap/providers.php';
    $providers = array_merge($providers, $extra);
}

echo "Testing " . count($providers) . " providers...\n";

foreach ($providers as $provider) {
    echo "ID: $provider ... ";
    ob_start();
    $app->register($provider);
    $out = ob_get_clean();
    if (strlen($out) > 0) {
        echo "[LEAKED: " . bin2hex(substr($out, 0, 50)) . "... len: " . strlen($out) . "]";
    } else {
        echo "OK";
    }
    echo "\n";
}
