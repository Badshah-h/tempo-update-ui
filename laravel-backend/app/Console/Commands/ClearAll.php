<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all caches including sessions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Clearing all caches...');
        
        // Clear application cache
        $this->call('cache:clear');
        
        // Clear configuration cache
        $this->call('config:clear');
        
        // Clear route cache
        $this->call('route:clear');
        
        // Clear view cache
        $this->call('view:clear');
        
        // Clear compiled views
        $this->call('view:cache');
        
        // Clear sessions (by truncating the sessions table)
        if (\Schema::hasTable('sessions')) {
            \DB::table('sessions')->truncate();
            $this->info('Sessions cleared.');
        }
        
        $this->info('All caches have been cleared successfully!');
        
        return Command::SUCCESS;
    }
}
