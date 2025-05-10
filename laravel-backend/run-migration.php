<?php

// This script will run the migration to add the status and last_active_at columns to the users table

// Get the database connection details from the .env file
$envFile = __DIR__ . '/.env';
$env = parse_ini_file($envFile);

// Connect to the database
$host = $env['DB_HOST'];
$port = $env['DB_PORT'];
$database = $env['DB_DATABASE'];
$username = $env['DB_USERNAME'];
$password = $env['DB_PASSWORD'];

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if the status column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
    $statusExists = $stmt->rowCount() > 0;
    
    // Check if the last_active_at column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'last_active_at'");
    $lastActiveExists = $stmt->rowCount() > 0;
    
    // Add the status column if it doesn't exist
    if (!$statusExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active' AFTER password");
        echo "Added status column to users table\n";
    } else {
        echo "Status column already exists\n";
    }
    
    // Add the last_active_at column if it doesn't exist
    if (!$lastActiveExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP NULL AFTER status");
        echo "Added last_active_at column to users table\n";
    } else {
        echo "Last active column already exists\n";
    }
    
    echo "Migration completed successfully\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
