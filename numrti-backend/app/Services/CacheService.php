<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Centralized cache service for consistent key management & TTLs.
 *
 * Cache tiers:
 *   STATIC   — data that almost never changes (categories, pages, blog categories)   → 60 min
 *   MODERATE — data that changes infrequently (featured numbers, blog posts)          → 15 min
 *   DYNAMIC  — data that changes often but still worth caching (stats, listings)      → 5 min
 */
class CacheService
{
    // ── TTLs in seconds ──────────────────────────────────────────
    const TTL_STATIC   = 3600;   // 60 min
    const TTL_MODERATE = 900;    // 15 min
    const TTL_DYNAMIC  = 300;    // 5 min
    const TTL_SHORT    = 120;    // 2 min

    // ── Key prefixes ─────────────────────────────────────────────
    const PREFIX_STATS       = 'stats';
    const PREFIX_CATEGORIES  = 'categories';
    const PREFIX_PHONES      = 'phones';
    const PREFIX_BLOG        = 'blog';
    const PREFIX_PAGES       = 'pages';
    const PREFIX_ORDERS      = 'orders';

    /**
     * Remember with a tagged prefix (makes group invalidation easy).
     */
    public static function remember(string $prefix, string $key, int $ttl, callable $callback)
    {
        $fullKey = "{$prefix}:{$key}";
        return Cache::remember($fullKey, $ttl, $callback);
    }

    /**
     * Forget a specific key under a prefix.
     */
    public static function forget(string $prefix, string $key): void
    {
        Cache::forget("{$prefix}:{$key}");
    }

    /**
     * Flush all keys matching a prefix pattern.
     * Works with database/file drivers by tracking known keys.
     */
    public static function flushPrefix(string $prefix): void
    {
        // Get tracked keys for this prefix
        $tracked = Cache::get("_tracked:{$prefix}", []);
        foreach ($tracked as $key) {
            Cache::forget($key);
        }
        Cache::forget("_tracked:{$prefix}");
    }

    /**
     * Remember + track the key so flushPrefix can find it later.
     */
    public static function rememberTracked(string $prefix, string $key, int $ttl, callable $callback)
    {
        $fullKey = "{$prefix}:{$key}";

        // Track this key
        $tracked = Cache::get("_tracked:{$prefix}", []);
        if (!in_array($fullKey, $tracked)) {
            $tracked[] = $fullKey;
            Cache::put("_tracked:{$prefix}", $tracked, self::TTL_STATIC * 2);
        }

        return Cache::remember($fullKey, $ttl, $callback);
    }

    // ── Convenience invalidators ─────────────────────────────────

    public static function clearStats(): void
    {
        self::flushPrefix(self::PREFIX_STATS);
    }

    public static function clearCategories(): void
    {
        self::flushPrefix(self::PREFIX_CATEGORIES);
    }

    public static function clearPhones(): void
    {
        self::flushPrefix(self::PREFIX_PHONES);
    }

    public static function clearBlog(): void
    {
        self::flushPrefix(self::PREFIX_BLOG);
    }

    public static function clearPages(): void
    {
        self::flushPrefix(self::PREFIX_PAGES);
    }

    public static function clearOrders(): void
    {
        self::flushPrefix(self::PREFIX_ORDERS);
    }

    /**
     * Nuclear option — clear everything we manage.
     */
    public static function clearAll(): void
    {
        self::clearStats();
        self::clearCategories();
        self::clearPhones();
        self::clearBlog();
        self::clearPages();
        self::clearOrders();
    }
}
