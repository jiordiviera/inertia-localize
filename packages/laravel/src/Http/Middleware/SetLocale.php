<?php

namespace InertiaLocalize\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use InertiaLocalize\LocaleResolver;
use Symfony\Component\HttpFoundation\Response;

final class SetLocale
{
    public function __construct(private readonly LocaleResolver $locales)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $sessionKey = config('inertia-localize.session_key', 'locale');
        $locale = $request->hasSession() ? $request->session()->get($sessionKey) : null;

        app()->setLocale($this->locales->resolve($locale));

        return $next($request);
    }
}
