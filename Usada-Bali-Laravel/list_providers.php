<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables;
use Illuminate\Foundation\Bootstrap\LoadConfiguration;
use Illuminate\Foundation\Bootstrap\RegisterFacades;

(new LoadEnvironmentVariables())->bootstrap($app);
(new LoadConfiguration())->bootstrap($app);
(new RegisterFacades())->bootstrap($app);

// This is the core set of providers registered automatically by Laravel 11's Application constructor if not overridden
$reflection = new ReflectionClass($app);
$property = $reflection->getProperty('serviceProviders');
$property->setAccessible(true);
$providers = $property->getValue($app);

echo "Currently registered instances: " . count($providers) . "\n";
foreach ($providers as $p) {
    echo "INST: " . get_class($p) . "\n";
}

// Now look at the providers that WILL be registered
$config = $app->make('config');
$providersToRegister = $config->get('app.providers', []);

echo "\nProviders in config (app.providers): " . count($providersToRegister) . "\n";
foreach ($providersToRegister as $p) {
    echo "CFG: $p\n";
}
