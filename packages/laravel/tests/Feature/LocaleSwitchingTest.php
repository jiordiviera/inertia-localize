<?php

namespace InertiaLocalize\Tests\Feature;

use InertiaLocalize\Tests\TestCase;

class LocaleSwitchingTest extends TestCase
{
    public function test_it_uses_the_default_locale_without_a_session_value(): void
    {
        $this->get('/locale-check')->assertExactJson(['locale' => 'en']);
    }

    public function test_it_uses_a_supported_locale_from_the_configured_session_key(): void
    {
        config(['inertia-localize.session_key' => 'language']);

        $this->withSession(['language' => 'fr'])
            ->get('/locale-check')
            ->assertExactJson(['locale' => 'fr']);
    }

    public function test_it_uses_the_default_locale_for_an_unsupported_session_value(): void
    {
        $this->withSession(['locale' => 'xx'])
            ->get('/locale-check')
            ->assertExactJson(['locale' => 'en']);
    }

    public function test_it_switches_to_a_supported_locale_for_the_next_request(): void
    {
        $this->from('/locale-check')
            ->post('/locale', ['locale' => 'fr'])
            ->assertRedirect('/locale-check');

        $this->get('/locale-check')->assertExactJson(['locale' => 'fr']);
    }

    public function test_it_rejects_switching_to_an_unsupported_locale(): void
    {
        $this->from('/locale-check')
            ->post('/locale', ['locale' => 'xx'])
            ->assertUnprocessable();
    }
}
