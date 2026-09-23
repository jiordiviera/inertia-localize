<?php

namespace InertiaLocalize;

use Illuminate\Support\ServiceProvider;

final class InertiaLocalizeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/inertia-localize.php', 'inertia-localize');
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/inertia-localize.php' => config_path('inertia-localize.php'),
            ], 'inertia-localize-config');
        }
    }
}
