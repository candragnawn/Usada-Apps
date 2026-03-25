<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables;
use Illuminate\Foundation\Bootstrap\LoadConfiguration;
use Illuminate\Foundation\Bootstrap\HandleExceptions;
use Illuminate\Foundation\Bootstrap\RegisterFacades;
use Illuminate\Foundation\Bootstrap\RegisterProviders;
use Illuminate\Foundation\Bootstrap\BootProviders;

$bootstrappers = [
    LoadEnvironmentVariables::class => "ENV",
    LoadConfiguration::class => "CONFIG",
    // HandleExceptions::class => "EXCEPTIONS", // Skipping as it might interfere
    RegisterFacades::class => "FACADES",
    RegisterProviders::class => "REG_PROVIDERS",
    BootProviders::class => "BOOT_PROVIDERS"
];

foreach ($bootstrappers as $bootstrapper => $name) {
    echo "Starting $name...\n";
    $b = new $bootstrapper();
    $b->bootstrap($app);
    echo "Finished $name.\n";
}

echo "END_OF_BOOTSTRAP_TEST\n";
