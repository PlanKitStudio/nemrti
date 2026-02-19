<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\AdEvent;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdController extends Controller
{
    // ─── PUBLIC ENDPOINTS ────────────────────────────────────────

    /**
     * Get active ads for a specific position.
     * Called by the frontend AdBanner component.
     */
    public function getByPosition(Request $request, string $position)
    {
        $ads = Ad::active()
            ->forPosition($position)
            ->orderByDesc('priority')
            ->get(['id', 'title', 'description', 'image_url', 'target_url', 'position', 'size']);

        return response()->json($ads);
    }

    /**
     * Record an ad impression (view).
     * Debounced per IP + ad combo for 5 minutes.
     * Includes fraud detection.
     */
    public function trackImpression(Request $request, Ad $ad)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        $cacheKey = "ad_impression:{$ad->id}:{$ip}";

        // Debounce: only record 1 impression per IP per ad per 5 min
        if (Cache::has($cacheKey)) {
            return response()->json(['status' => 'debounced']);
        }

        // Fraud detection
        $fraudReason = AdEvent::detectFraud($ip, $userAgent, $ad->id, 'impression');
        $isSuspicious = $fraudReason !== null;

        AdEvent::create([
            'ad_id' => $ad->id,
            'event_type' => 'impression',
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'page_url' => $request->input('page_url'),
            'referer' => $request->header('referer'),
            'device_type' => AdEvent::detectDeviceType($userAgent),
            'is_suspicious' => $isSuspicious,
            'fraud_reason' => $fraudReason,
            'created_at' => now(),
        ]);

        // Only increment counter for clean (non-suspicious) events
        if (!$isSuspicious) {
            $ad->increment('impressions_count');
        }

        Cache::put($cacheKey, true, 300); // 5 min debounce

        return response()->json(['status' => $isSuspicious ? 'flagged' : 'recorded']);
    }

    /**
     * Record an ad click.
     * Debounced per IP + ad combo for 1 minute.
     * Includes fraud detection.
     */
    public function trackClick(Request $request, Ad $ad)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        $cacheKey = "ad_click:{$ad->id}:{$ip}";

        if (Cache::has($cacheKey)) {
            return response()->json(['status' => 'debounced']);
        }

        // Fraud detection
        $fraudReason = AdEvent::detectFraud($ip, $userAgent, $ad->id, 'click');
        $isSuspicious = $fraudReason !== null;

        AdEvent::create([
            'ad_id' => $ad->id,
            'event_type' => 'click',
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'page_url' => $request->input('page_url'),
            'referer' => $request->header('referer'),
            'device_type' => AdEvent::detectDeviceType($userAgent),
            'is_suspicious' => $isSuspicious,
            'fraud_reason' => $fraudReason,
            'created_at' => now(),
        ]);

        if (!$isSuspicious) {
            $ad->increment('clicks_count');
        }

        Cache::put($cacheKey, true, 60); // 1 min debounce

        return response()->json(['status' => $isSuspicious ? 'flagged' : 'recorded']);
    }

    /**
     * Record a conversion (action after click).
     * Debounced per IP + ad combo for 10 minutes.
     */
    public function trackConversion(Request $request, Ad $ad)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        $cacheKey = "ad_conversion:{$ad->id}:{$ip}";

        if (Cache::has($cacheKey)) {
            return response()->json(['status' => 'debounced']);
        }

        // Must have a corresponding click first (within last 24 hours)
        $hasClick = AdEvent::where('ad_id', $ad->id)
            ->where('ip_address', $ip)
            ->where('event_type', 'click')
            ->where('created_at', '>=', now()->subDay())
            ->where('is_suspicious', false)
            ->exists();

        if (!$hasClick) {
            return response()->json(['status' => 'no_click_found'], 422);
        }

        $fraudReason = AdEvent::detectFraud($ip, $userAgent, $ad->id, 'conversion');
        $isSuspicious = $fraudReason !== null;

        AdEvent::create([
            'ad_id' => $ad->id,
            'event_type' => 'conversion',
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'page_url' => $request->input('page_url'),
            'referer' => $request->header('referer'),
            'device_type' => AdEvent::detectDeviceType($userAgent),
            'is_suspicious' => $isSuspicious,
            'fraud_reason' => $fraudReason,
            'created_at' => now(),
        ]);

        if (!$isSuspicious) {
            $ad->increment('conversions_count');
        }

        Cache::put($cacheKey, true, 600); // 10 min debounce

        return response()->json(['status' => $isSuspicious ? 'flagged' : 'recorded']);
    }

    // ─── ADMIN CRUD ──────────────────────────────────────────────

    /**
     * List all ads for admin with pagination.
     */
    public function index(Request $request)
    {
        $query = Ad::latest();

        if ($request->has('position') && $request->position !== 'all') {
            $query->where('position', $request->position);
        }

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = (int) $request->input('per_page', 20);
        $perPage = min(max($perPage, 5), 100); // clamp between 5 and 100

        $ads = $query->paginate($perPage);

        // Append computed attributes
        $ads->getCollection()->each(function ($ad) {
            $ad->ctr = $ad->ctr;
            $ad->conversion_rate = $ad->conversion_rate;
        });

        return response()->json($ads);
    }

    /**
     * Store a new ad. Supports image file upload.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp,svg|max:5120', // up to 5MB
            'image_url' => 'nullable|string',
            'target_url' => 'required|string|max:2048',
            'position' => 'required|string|in:header,sidebar,footer,inline,home-mid,numbers-header,numbers-inline,numbers-footer,blog-header,blog-inline,blog-footer',
            'size' => 'required|string|max:20',
            'is_active' => 'boolean',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('ads', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }
        unset($validated['image']);

        $ad = Ad::create($validated);

        return response()->json($ad, 201);
    }

    /**
     * Show a single ad.
     */
    public function show(Ad $ad)
    {
        $ad->ctr = $ad->ctr;
        $ad->conversion_rate = $ad->conversion_rate;
        return response()->json($ad);
    }

    /**
     * Update an ad. Supports image file upload.
     */
    public function update(Request $request, Ad $ad)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp,svg|max:5120',
            'image_url' => 'nullable|string',
            'target_url' => 'sometimes|string|max:2048',
            'position' => 'sometimes|string|in:header,sidebar,footer,inline,home-mid,numbers-header,numbers-inline,numbers-footer,blog-header,blog-inline,blog-footer',
            'size' => 'sometimes|string|max:20',
            'is_active' => 'boolean',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|integer|min:0',
        ]);

        // Handle image upload — delete old file if replacing
        if ($request->hasFile('image')) {
            // Delete old uploaded image if it was stored locally
            if ($ad->image_url && str_starts_with($ad->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $ad->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('ads', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }
        unset($validated['image']);

        $ad->update($validated);
        $ad->ctr = $ad->ctr;
        $ad->conversion_rate = $ad->conversion_rate;

        return response()->json($ad);
    }

    /**
     * Delete an ad.
     */
    public function destroy(Ad $ad)
    {
        $ad->delete();
        return response()->json(['message' => 'تم حذف الإعلان بنجاح']);
    }

    // ─── ADMIN ANALYTICS ─────────────────────────────────────────

    /**
     * Get comprehensive analytics data.
     */
    public function analytics(Request $request)
    {
        $days = match ($request->input('period', '7days')) {
            '7days' => 7,
            '30days' => 30,
            '90days' => 90,
            default => 7,
        };

        $startDate = now()->subDays($days)->startOfDay();
        $endDate = now()->endOfDay();

        // If custom date range provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = \Carbon\Carbon::parse($request->start_date)->startOfDay();
            $endDate = \Carbon\Carbon::parse($request->end_date)->endOfDay();
            $days = $startDate->diffInDays($endDate) + 1;
        }

        $positionFilter = $request->input('page', 'all');

        // ── Overall stats ──
        $eventsQuery = AdEvent::whereBetween('created_at', [$startDate, $endDate]);
        if ($positionFilter !== 'all') {
            $eventsQuery->whereHas('ad', fn ($q) => $q->where('position', $positionFilter));
        }

        $totalImpressions = (clone $eventsQuery)->where('event_type', 'impression')->where('is_suspicious', false)->count();
        $totalClicks = (clone $eventsQuery)->where('event_type', 'click')->where('is_suspicious', false)->count();
        $totalConversions = (clone $eventsQuery)->where('event_type', 'conversion')->where('is_suspicious', false)->count();
        $uniqueVisitors = (clone $eventsQuery)->where('is_suspicious', false)->distinct('ip_address')->count('ip_address');
        $averageCTR = $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0;
        $conversionRate = $totalClicks > 0 ? round(($totalConversions / $totalClicks) * 100, 2) : 0;

        // Fraud stats
        $suspiciousEvents = (clone $eventsQuery)->where('is_suspicious', true)->count();
        $blockedClicks = (clone $eventsQuery)->where('event_type', 'click')->where('is_suspicious', true)->count();
        $blockedImpressions = (clone $eventsQuery)->where('event_type', 'impression')->where('is_suspicious', true)->count();

        // Revenue from ad budgets (active ads in the period)
        $adsQuery = Ad::query();
        if ($positionFilter !== 'all') {
            $adsQuery->where('position', $positionFilter);
        }
        $totalRevenue = $adsQuery->sum('budget');

        // ── Previous period for change comparison ──
        $prevStartDate = (clone $startDate)->subDays($days);
        $prevEndDate = (clone $startDate)->subSecond();

        $prevEventsQuery = AdEvent::whereBetween('created_at', [$prevStartDate, $prevEndDate]);
        if ($positionFilter !== 'all') {
            $prevEventsQuery->whereHas('ad', fn ($q) => $q->where('position', $positionFilter));
        }

        $prevImpressions = (clone $prevEventsQuery)->where('event_type', 'impression')->where('is_suspicious', false)->count();
        $prevClicks = (clone $prevEventsQuery)->where('event_type', 'click')->where('is_suspicious', false)->count();
        $prevConversions = (clone $prevEventsQuery)->where('event_type', 'conversion')->where('is_suspicious', false)->count();
        $prevVisitors = (clone $prevEventsQuery)->where('is_suspicious', false)->distinct('ip_address')->count('ip_address');

        $overallStats = [
            'totalImpressions' => $totalImpressions,
            'totalClicks' => $totalClicks,
            'totalConversions' => $totalConversions,
            'totalRevenue' => (float) $totalRevenue,
            'averageCTR' => $averageCTR,
            'conversionRate' => $conversionRate,
            'uniqueVisitors' => $uniqueVisitors,
            'fraud' => [
                'suspiciousEvents' => $suspiciousEvents,
                'blockedClicks' => $blockedClicks,
                'blockedImpressions' => $blockedImpressions,
            ],
            'changes' => [
                'impressions' => $this->calcChange($totalImpressions, $prevImpressions),
                'clicks' => $this->calcChange($totalClicks, $prevClicks),
                'conversions' => $this->calcChange($totalConversions, $prevConversions),
                'visitors' => $this->calcChange($uniqueVisitors, $prevVisitors),
            ],
        ];

        // ── Daily stats ──
        $dailyStats = AdEvent::whereBetween('created_at', [$startDate, $endDate])
            ->where('is_suspicious', false)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN event_type = 'impression' THEN 1 ELSE 0 END) as impressions"),
                DB::raw("SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) as clicks"),
                DB::raw("SUM(CASE WHEN event_type = 'conversion' THEN 1 ELSE 0 END) as conversions"),
                DB::raw("COUNT(DISTINCT ip_address) as visitors")
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // ── Per-position (page) stats ──
        $pageStats = AdEvent::whereBetween('ad_events.created_at', [$startDate, $endDate])
            ->where('ad_events.is_suspicious', false)
            ->join('ads', 'ad_events.ad_id', '=', 'ads.id')
            ->select(
                'ads.position',
                DB::raw("SUM(CASE WHEN ad_events.event_type = 'impression' THEN 1 ELSE 0 END) as impressions"),
                DB::raw("SUM(CASE WHEN ad_events.event_type = 'click' THEN 1 ELSE 0 END) as clicks"),
                DB::raw("SUM(CASE WHEN ad_events.event_type = 'conversion' THEN 1 ELSE 0 END) as conversions"),
                DB::raw("COUNT(DISTINCT ad_events.ip_address) as unique_visitors")
            )
            ->groupBy('ads.position')
            ->get()
            ->map(function ($row) {
                $positionNames = [
                    'header' => 'رأس الصفحة',
                    'sidebar' => 'الشريط الجانبي',
                    'footer' => 'أسفل الصفحة',
                    'inline' => 'داخل المحتوى',
                    'home-mid' => 'وسط الصفحة الرئيسية',
                    'numbers-header' => 'رأس صفحة الأرقام',
                    'numbers-inline' => 'داخل صفحة الأرقام',
                    'numbers-footer' => 'أسفل صفحة الأرقام',
                    'blog-header' => 'رأس المدونة',
                    'blog-inline' => 'داخل المدونة',
                    'blog-footer' => 'أسفل المدونة',
                ];
                return [
                    'position' => $row->position,
                    'positionName' => $positionNames[$row->position] ?? $row->position,
                    'impressions' => (int) $row->impressions,
                    'clicks' => (int) $row->clicks,
                    'conversions' => (int) $row->conversions,
                    'ctr' => $row->impressions > 0 ? round(($row->clicks / $row->impressions) * 100, 2) : 0,
                    'conversionRate' => $row->clicks > 0 ? round(($row->conversions / $row->clicks) * 100, 2) : 0,
                    'uniqueVisitors' => (int) $row->unique_visitors,
                ];
            });

        // ── Device stats ──
        $deviceStats = AdEvent::whereBetween('created_at', [$startDate, $endDate])
            ->where('is_suspicious', false)
            ->select(
                'device_type',
                DB::raw("SUM(CASE WHEN event_type = 'impression' THEN 1 ELSE 0 END) as impressions"),
                DB::raw("SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) as clicks"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('device_type')
            ->get()
            ->map(function ($row) use ($totalImpressions, $totalClicks) {
                $deviceNames = [
                    'mobile' => 'الهاتف المحمول',
                    'desktop' => 'الكمبيوتر المكتبي',
                    'tablet' => 'الجهاز اللوحي',
                    'unknown' => 'غير معروف',
                ];
                $colors = [
                    'mobile' => '#3b82f6',
                    'desktop' => '#10b981',
                    'tablet' => '#f59e0b',
                    'unknown' => '#6b7280',
                ];
                $totalEvents = $totalImpressions + $totalClicks;
                return [
                    'device' => $row->device_type ?? 'unknown',
                    'deviceArabic' => $deviceNames[$row->device_type] ?? 'غير معروف',
                    'impressions' => (int) $row->impressions,
                    'clicks' => (int) $row->clicks,
                    'percentage' => $totalEvents > 0 ? round(($row->total / $totalEvents) * 100, 1) : 0,
                    'color' => $colors[$row->device_type] ?? '#6b7280',
                ];
            });

        // ── Top ads ──
        $topAds = Ad::withCount([
            'events as period_impressions' => fn ($q) => $q->where('event_type', 'impression')->where('is_suspicious', false)->whereBetween('created_at', [$startDate, $endDate]),
            'events as period_clicks' => fn ($q) => $q->where('event_type', 'click')->where('is_suspicious', false)->whereBetween('created_at', [$startDate, $endDate]),
            'events as period_conversions' => fn ($q) => $q->where('event_type', 'conversion')->where('is_suspicious', false)->whereBetween('created_at', [$startDate, $endDate]),
        ])
            ->orderByDesc('period_impressions')
            ->limit(10)
            ->get()
            ->map(function ($ad) {
                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'position' => $ad->position,
                    'impressions' => $ad->period_impressions,
                    'clicks' => $ad->period_clicks,
                    'conversions' => $ad->period_conversions,
                    'ctr' => $ad->period_impressions > 0 ? round(($ad->period_clicks / $ad->period_impressions) * 100, 2) : 0,
                    'conversionRate' => $ad->period_clicks > 0 ? round(($ad->period_conversions / $ad->period_clicks) * 100, 2) : 0,
                    'is_active' => $ad->is_active,
                ];
            });

        return response()->json([
            'overall' => $overallStats,
            'daily' => $dailyStats,
            'pages' => $pageStats,
            'devices' => $deviceStats,
            'topAds' => $topAds,
        ]);
    }

    private function calcChange(int $current, int $previous): array
    {
        if ($previous === 0) {
            return ['value' => $current > 0 ? 100 : 0, 'type' => 'increase'];
        }
        $change = round((($current - $previous) / $previous) * 100, 1);
        return [
            'value' => abs($change),
            'type' => $change >= 0 ? 'increase' : 'decrease',
        ];
    }
}
