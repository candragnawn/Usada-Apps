<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables;
use Illuminate\Foundation\Bootstrap\LoadConfiguration;
use Illuminate\Foundation\Bootstrap\HandleExceptions;
use Illuminate\Foundation\Bootstrap\RegisterFacades;

(new LoadEnvironmentVariables())->bootstrap($app);
(new LoadConfiguration())->bootstrap($app);
(new RegisterFacades())->bootstrap($app);

$providers = $app->make('config')->get('app.providers', []);
// For Laravel 11, we might need a different way to get the list if it's not in config
if (empty($providers)) {
    // If it's an L11 app, it might be using the default set from Illuminate\Foundation\Application
    $providers = (new ReflectionClass($app))->getProperty('serviceProviders')->getValue($app);
}

echo "Found " . count($providers) . " providers.\n";

foreach ($providers as $provider) {
    $name = is_object($provider) ? get_class($provider) : $provider;
    echo "Registering $name... ";
    ob_start();
    try {
        if (is_string($provider)) {
            $app->register($provider);
        }
    } catch (\Exception $e) {
        echo " [ERROR: " . $e->getMessage() . "] ";
    }
    $out = ob_get_clean();
    if (strlen($out) > 0) {
        echo " [LEAKED: " . bin2hex($out) . "] ";
    }
    echo "Done.\n";
}

echo "END_OF_PROVIDER_TEST\n";
