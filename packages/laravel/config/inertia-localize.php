<?php

return [
    'default' => env('APP_LOCALE', 'en'),
    'fallback' => env('APP_FALLBACK_LOCALE', 'en'),
    'locales' => [
        'en' => ['name' => 'English'],
        'fr' => ['name' => 'Français'],
    ],
    'session_key' => 'locale',
    'groups' => ['ui'],
    'user_column' => null,
];
