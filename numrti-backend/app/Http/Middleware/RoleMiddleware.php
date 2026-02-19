<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            abort(403, 'غير مصرح لك بالوصول لهذا المحتوى');
        }

        // Super-admin has access to everything
        if ($request->user()->hasRole('super-admin')) {
            return $next($request);
        }

        if (!$request->user()->hasRole($role)) {
            abort(403, 'غير مصرح لك بالوصول لهذا المحتوى');
        }

        return $next($request);
    }
}
