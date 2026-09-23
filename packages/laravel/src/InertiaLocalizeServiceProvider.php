<?php

namespace InertiaLocalize;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

final class InertiaLocalizeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/inertia-localize.php', 'inertia-localize');
        $this->app->singleton(LocaleResolver::class);
        $this->app->singleton(I18nData::class);
    }

    public function boot(): void
    {
        Inertia::share('i18n', Inertia::always(
            static fn (): array => app(I18nData::class)->toArray(),
        ));

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/inertia-localize.php' => config_path('inertia-localize.php'),
            ], 'inertia-localize-config');
        }
    }
}
