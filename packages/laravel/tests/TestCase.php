<?php

namespace InertiaLocalize\Tests;

use InertiaLocalize\InertiaLocalizeServiceProvider;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

abstract class TestCase extends OrchestraTestCase
{
    protected string $testConfigPath;

    protected function getPackageProviders($app): array
    {
        return [InertiaLocalizeServiceProvider::class];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $this->testConfigPath = sys_get_temp_dir().'/inertia-localize-test-'.bin2hex(random_bytes(8));

        if (! mkdir($this->testConfigPath, 0777, true) && ! is_dir($this->testConfigPath)) {
            throw new \RuntimeException('Unable to create the temporary Laravel config directory.');
        }

        $app->useConfigPath($this->testConfigPath);
    }

    protected function tearDown(): void
    {
        if (isset($this->testConfigPath)) {
            $publishedConfig = $this->testConfigPath.'/inertia-localize.php';

            if (is_file($publishedConfig)) {
                unlink($publishedConfig);
            }

            if (is_dir($this->testConfigPath)) {
                rmdir($this->testConfigPath);
            }
        }

        parent::tearDown();
    }
}
