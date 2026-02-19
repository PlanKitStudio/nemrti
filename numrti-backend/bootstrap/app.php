<?php

use App\Http\Middleware\HttpCacheHeaders;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'http.cache' => HttpCacheHeaders::class,
        ]);
        
        // Enable CORS for API
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Return JSON 401 for unauthenticated API requests instead of redirecting
        $middleware->redirectGuestsTo(fn ($request) =>
            $request->expectsJson() || $request->is('api/*')
                ? null                          // return null → triggers 401 JSON
                : route('login')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Render authentication exceptions as JSON for API routes
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json(['message' => 'غير مصرح'], 401);
            }
        });
    })->create();
