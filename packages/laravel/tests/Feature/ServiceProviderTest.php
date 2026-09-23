<?php

namespace InertiaLocalize\Tests\Feature;

use InertiaLocalize\InertiaLocalizeServiceProvider;
use InertiaLocalize\Tests\TestCase;

class ServiceProviderTest extends TestCase
{
    public function test_it_registers_the_default_configuration(): void
    {
        $this->assertSame('en', config('inertia-localize.default'));
        $this->assertSame('en', config('inertia-localize.fallback'));
        $this->assertSame([
            'en' => ['name' => 'English'],
            'fr' => ['name' => 'Français'],
        ], config('inertia-localize.locales'));
        $this->assertSame('locale', config('inertia-localize.session_key'));
        $this->assertSame(['ui'], config('inertia-localize.groups'));
        $this->assertNull(config('inertia-localize.user_column'));
    }

    public function test_it_publishes_the_configuration_file(): void
    {
        $this->artisan('vendor:publish', [
            '--tag' => 'inertia-localize-config',
            '--force' => true,
        ])->assertExitCode(0);

        $this->assertFileExists($this->testConfigPath.'/inertia-localize.php');
    }
}
