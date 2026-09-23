<?php

namespace InertiaLocalize\Tests\Integration;

use InertiaLocalize\Tests\TestCase;
use PHPUnit\Framework\Attributes\Group;

#[Group('e2e')]
class ReactLaravelIntegrationTest extends TestCase
{
    public function test_locale_switch_flows_from_laravel_language_files_through_inertia_to_react_ssr(): void
    {
        $repositoryRoot = dirname(__DIR__, 4);
        $this->app['translation.loader']->addPath($repositoryRoot.'/fixtures/react-laravel/lang');

        $englishPage = $this->withSession(['locale' => 'en'])
            ->get('/inertia-props')
            ->assertOk()
            ->viewData('page');

        $this->assertSame('en', $englishPage['props']['i18n']['locale']);
        $this->assertSame('Hello :name', $englishPage['props']['i18n']['messages']['ui.greeting']);

        $this->from('/locale-check')
            ->post('/locale', ['locale' => 'fr'])
            ->assertRedirect('/locale-check');

        $frenchPage = $this->get('/inertia-props')->assertOk()->viewData('page');

        $this->assertSame('fr', $frenchPage['props']['i18n']['locale']);
        $this->assertSame('Bonjour :name', $frenchPage['props']['i18n']['messages']['ui.greeting']);

        $renderer = $repositoryRoot.'/packages/react/test/renderInertiaPage.mjs';
        $process = proc_open(
            ['node', $renderer],
            [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $pipes,
            $repositoryRoot,
        );

        $this->assertIsResource($process, 'Unable to start the React SSR renderer.');

        fwrite($pipes[0], json_encode([$englishPage, $frenchPage], JSON_THROW_ON_ERROR));
        fclose($pipes[0]);
        $output = stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        $error = stream_get_contents($pipes[2]);
        fclose($pipes[2]);
        $exitCode = proc_close($process);

        $this->assertSame(0, $exitCode, $error);
        $renderedPages = json_decode($output, true, 512, JSON_THROW_ON_ERROR);

        $this->assertStringContainsString('<h1 lang="en">Hello Ada</h1>', $renderedPages[0]);
        $this->assertStringContainsString('<h1 lang="fr">Bonjour Ada</h1>', $renderedPages[1]);
    }
}
