<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Adds Cache-Control / ETag headers to GET responses.
 * Browser & CDN can cache the response, reducing server hits.
 */
class HttpCacheHeaders
{
    public function handle(Request $request, Closure $next, string $maxAge = '300'): Response
    {
        $response = $next($request);

        // Only cache successful GET/HEAD requests
        if (!$request->isMethodCacheable() || !$response->isSuccessful()) {
            return $response;
        }

        // Don't cache if user is authenticated (private data)
        if ($request->user()) {
            $response->headers->set('Cache-Control', 'private, no-cache');
            return $response;
        }

        $seconds = (int) $maxAge;

        // ETag based on content hash
        $etag = md5($response->getContent());
        $response->headers->set('ETag', "\"{$etag}\"");

        // If client sends matching ETag, return 304
        if ($request->header('If-None-Match') === "\"{$etag}\"") {
            $response->setStatusCode(304);
            $response->setContent('');
            return $response;
        }

        $response->headers->set('Cache-Control', "public, max-age={$seconds}, s-maxage={$seconds}");

        return $response;
    }
}
