<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=ka_bootcamp_laravel", "root", "");
    
    $tables = ['categories', 'products', 'articles', 'users'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
        $count = $stmt->fetchColumn();
        echo "$table: $count rows\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
