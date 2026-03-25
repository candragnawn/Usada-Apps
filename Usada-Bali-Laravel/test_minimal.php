<?php

echo "START_OF_SCRIPT\n";

require __DIR__.'/vendor/autoload.php';
echo "AFTER_AUTOLOAD\n";

$app = require_once __DIR__.'/bootstrap/app.php';
echo "AFTER_BOOTSTRAP_APP\n";

// $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
// $kernel->bootstrap();
echo "END_OF_SCRIPT\n";
