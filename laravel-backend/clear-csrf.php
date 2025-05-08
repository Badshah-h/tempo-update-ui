<?php

/**
 * Simple script to clear Laravel CSRF cache and sessions
 *
 * This script is a shortcut to run the clear:all command
 * which clears all Laravel caches including sessions.
 */

echo "Clearing all Laravel caches including sessions...\n";

// Run the artisan command
exec('php artisan clear:all', $output, $returnCode);

// Output results
foreach ($output as $line) {
    echo $line . "\n";
}

echo "CSRF cache clearing complete!\n";
