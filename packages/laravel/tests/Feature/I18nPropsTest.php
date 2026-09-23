<?php

namespace InertiaLocalize\Tests\Feature;

use InertiaLocalize\Tests\TestCase;

class I18nPropsTest extends TestCase
{
    public function test_it_shares_locales_and_flattened_messages_from_configured_groups(): void
    {
        config([
            'inertia-localize.locales' => [
                'en' => ['name' => 'English'],
                'fr' => ['name' => 'Français'],
                'es' => [],
            ],
            'inertia-localize.groups' => ['ui', 'auth'],
        ]);

        $this->app['translator']->addLines([
            'ui.actions.save' => 'Enregistrer',
            'ui.navigation.home' => 'Accueil',
            'auth.failed' => 'Échec de connexion',
        ], 'fr');

        $response = $this->withSession(['locale' => 'fr'])->get('/inertia-props');

        $response->assertOk()->assertInertia();
        $this->assertSame([
            'locale' => 'fr',
            'fallback' => 'en',
            'locales' => [
                ['code' => 'en', 'name' => 'English'],
                ['code' => 'fr', 'name' => 'Français'],
                ['code' => 'es', 'name' => 'es'],
            ],
            'messages' => [
                'ui.actions.save' => 'Enregistrer',
                'ui.navigation.home' => 'Accueil',
                'auth.failed' => 'Échec de connexion',
            ],
        ], $response->inertiaProps('i18n'));
    }

    public function test_i18n_prop_is_included_in_partial_inertia_responses(): void
    {
        config(['inertia-localize.groups' => []]);

        $response = $this->withSession(['locale' => 'fr'])
            ->withHeaders([
                'X-Inertia' => 'true',
                'X-Inertia-Partial-Component' => 'Dashboard',
                'X-Inertia-Partial-Data' => 'other',
            ])
            ->get('/inertia-props');

        $response->assertOk();
        $response->assertJsonPath('props.i18n.locale', 'fr');
    }
}
