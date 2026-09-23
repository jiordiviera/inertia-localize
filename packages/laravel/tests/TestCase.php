<?php

namespace InertiaLocalize\Tests;

use InertiaLocalize\InertiaLocalizeServiceProvider;
use InertiaLocalize\Http\Controllers\LocaleController;
use InertiaLocalize\Http\Middleware\SetLocale;
use Inertia\ServiceProvider as InertiaServiceProvider;
use Inertia\Inertia;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

abstract class TestCase extends OrchestraTestCase
{
    protected string $testConfigPath;
    protected string $testViewPath;

    protected function getPackageProviders($app): array
    {
        return [InertiaServiceProvider::class, InertiaLocalizeServiceProvider::class];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $this->testConfigPath = sys_get_temp_dir().'/inertia-localize-test-'.bin2hex(random_bytes(8));

        if (! mkdir($this->testConfigPath, 0777, true) && ! is_dir($this->testConfigPath)) {
            throw new \RuntimeException('Unable to create the temporary Laravel config directory.');
        }

        $app->useConfigPath($this->testConfigPath);
        $app['config']->set('app.key', '0123456789abcdef0123456789abcdef');

        $this->testViewPath = $this->testConfigPath.'/views';
        mkdir($this->testViewPath, 0777, true);
        file_put_contents($this->testViewPath.'/app.blade.php', '<!doctype html><html><body>@inertia</body></html>');
        $app['view']->addLocation($this->testViewPath);
    }

    protected function defineRoutes($router): void
    {
        $router->middleware('web')->group(function ($router): void {
            $router->get('/locale-check', static fn () => response()->json([
                'locale' => app()->getLocale(),
            ]))->middleware(SetLocale::class);

            $router->get('/inertia-props', static fn () => Inertia::render('Dashboard'))
                ->middleware(SetLocale::class);

            $router->post('/locale', LocaleController::class)->middleware(SetLocale::class);
        });
    }

    protected function tearDown(): void
    {
        if (isset($this->testConfigPath)) {
            $publishedConfig = $this->testConfigPath.'/inertia-localize.php';

            if (is_file($publishedConfig)) {
                unlink($publishedConfig);
            }

            if (is_dir($this->testConfigPath)) {
                $testView = $this->testViewPath.'/app.blade.php';

                if (is_file($testView)) {
                    unlink($testView);
                }

                if (is_dir($this->testViewPath)) {
                    rmdir($this->testViewPath);
                }

                rmdir($this->testConfigPath);
            }
        }

        parent::tearDown();
    }
}
