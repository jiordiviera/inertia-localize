<?php

namespace InertiaLocalize;

final class LocaleResolver
{
    public function isSupported(mixed $locale): bool
    {
        return is_string($locale)
            && array_key_exists($locale, (array) config('inertia-localize.locales', []));
    }

    public function resolve(mixed $locale): string
    {
        if ($this->isSupported($locale)) {
            return $locale;
        }

        $default = config('inertia-localize.default', 'en');

        if ($this->isSupported($default)) {
            return $default;
        }

        $fallback = config('inertia-localize.fallback', 'en');

        if ($this->isSupported($fallback)) {
            return $fallback;
        }

        $locales = array_keys((array) config('inertia-localize.locales', []));

        return $locales[0] ?? (is_string($fallback) && $fallback !== '' ? $fallback : 'en');
    }
}
