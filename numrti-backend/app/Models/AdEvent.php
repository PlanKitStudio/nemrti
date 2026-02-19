<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ad_id',
        'event_type',
        'ip_address',
        'user_agent',
        'page_url',
        'referer',
        'device_type',
        'country',
        'city',
        'is_suspicious',
        'fraud_reason',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'is_suspicious' => 'boolean',
    ];

    // Relationships
    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }

    // Helper to detect device type from user agent
    public static function detectDeviceType(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';
        $ua = strtolower($userAgent);

        if (preg_match('/tablet|ipad|playbook|silk/i', $ua)) {
            return 'tablet';
        }
        if (preg_match('/mobile|android|iphone|ipod|opera mini|iemobile/i', $ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Detect if a request is from a known bot/crawler.
     */
    public static function isBot(?string $userAgent): bool
    {
        if (!$userAgent || strlen($userAgent) < 10) return true;

        $botPatterns = [
            'bot', 'crawl', 'spider', 'slurp', 'bingpreview',
            'mediapartners', 'adsbot', 'googlebot', 'baiduspider',
            'yandex', 'sogou', 'exabot', 'facebot', 'facebookexternalhit',
            'ia_archiver', 'semrush', 'ahrefsbot', 'mj12bot', 'dotbot',
            'petalbot', 'bytespider', 'gptbot', 'ccbot', 'headlesschrome',
            'phantomjs', 'selenium', 'puppeteer', 'wget', 'curl',
            'httpie', 'python-requests', 'python-urllib', 'go-http-client',
            'java/', 'apache-httpclient', 'okhttp',
        ];

        $ua = strtolower($userAgent);
        foreach ($botPatterns as $pattern) {
            if (str_contains($ua, $pattern)) return true;
        }

        return false;
    }

    /**
     * Analyse a request for fraud signals and return reasons if suspicious.
     * Returns null if clean, or a string reason if suspicious.
     */
    public static function detectFraud(string $ip, ?string $userAgent, string $adId, string $eventType): ?string
    {
        // 1. Bot detection
        if (self::isBot($userAgent)) {
            return 'bot_detected';
        }

        // 2. Missing/short user agent
        if (!$userAgent || strlen($userAgent) < 20) {
            return 'invalid_user_agent';
        }

        // 3. High-frequency clicks from same IP in the last hour (more than 10)
        $recentCount = self::where('ip_address', $ip)
            ->where('event_type', $eventType)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($eventType === 'click' && $recentCount > 10) {
            return 'click_flood';
        }

        if ($eventType === 'impression' && $recentCount > 50) {
            return 'impression_flood';
        }

        // 4. Same IP clicking many different ads in short time (click farm pattern)
        if ($eventType === 'click') {
            $distinctAds = self::where('ip_address', $ip)
                ->where('event_type', 'click')
                ->where('created_at', '>=', now()->subMinutes(10))
                ->distinct('ad_id')
                ->count('ad_id');

            if ($distinctAds >= 5) {
                return 'multi_ad_click_farm';
            }
        }

        return null;
    }
}
