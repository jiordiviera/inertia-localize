<?php

namespace InertiaLocalize;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;

final class I18nData
{
    public function __construct(private readonly LocaleResolver $locales)
    {
    }

    /**
     * @return array{
     *     locale: string,
     *     fallback: string,
     *     locales: list<array{code: string, name: string}>,
     *     messages: array<string, string>
     * }
     */
    public function toArray(): array
    {
        $supportedLocales = (array) config('inertia-localize.locales', []);
        $locale = $this->locales->resolve(app()->getLocale());
        $fallback = $this->locales->resolve(config('inertia-localize.fallback', 'en'));
        $locales = [];

        foreach ($supportedLocales as $code => $metadata) {
            if (! is_string($code)) {
                continue;
            }

            $locales[] = [
                'code' => $code,
                'name' => is_array($metadata) && is_string($metadata['name'] ?? null)
                    ? $metadata['name']
                    : $code,
            ];
        }

        $messages = [];

        foreach ((array) config('inertia-localize.groups', []) as $group) {
            if (! is_string($group) || $group === '') {
                continue;
            }

            $translations = Lang::get($group, [], $locale);

            if (! is_array($translations)) {
                continue;
            }

            foreach (Arr::dot($translations) as $key => $message) {
                if (is_string($message)) {
                    $messages[$group.'.'.$key] = $message;
                }
            }
        }

        return [
            'locale' => $locale,
            'fallback' => $fallback,
            'locales' => $locales,
            'messages' => $messages,
        ];
    }
}
