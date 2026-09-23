<?php

namespace InertiaLocalize\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use InertiaLocalize\LocaleResolver;

final class LocaleController
{
    public function __construct(
        private readonly LocaleResolver $locales,
        private readonly Redirector $redirector,
    ) {
    }

    public function __invoke(Request $request)
    {
        $locale = $request->input('locale');

        if (! $this->locales->isSupported($locale)) {
            throw new HttpResponseException(response('Unsupported locale.', 422));
        }

        $sessionKey = config('inertia-localize.session_key', 'locale');
        $request->session()->put($sessionKey, $locale);

        return $this->redirector->back();
    }
}
