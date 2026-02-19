<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Contact;
use App\Models\Order;
use App\Models\PhoneNumber;
use App\Models\User;
use App\Services\CacheService;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    /**
     * Get dashboard statistics (admin only)
     * Cached for 5 min — invalidated on order/number/user changes.
     */
    public function index()
    {
        $data = CacheService::rememberTracked(
            CacheService::PREFIX_STATS,
            'dashboard',
            CacheService::TTL_DYNAMIC,
            function () {
                return [
                    'users' => [
                        'total' => User::count(),
                        'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
                    ],
                    'phone_numbers' => [
                        'total' => PhoneNumber::count(),
                        'available' => PhoneNumber::available()->count(),
                        'sold' => PhoneNumber::where('is_sold', true)->count(),
                        'featured' => PhoneNumber::featured()->count(),
                    ],
                    'orders' => [
                        'total' => Order::count(),
                        'pending' => Order::pending()->count(),
                        'completed' => Order::where('status', 'completed')->count(),
                        'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
                        'this_month_revenue' => Order::where('status', 'completed')
                            ->whereMonth('created_at', now()->month)
                            ->sum('total_price'),
                    ],
                    'blog_posts' => [
                        'total' => BlogPost::count(),
                        'published' => BlogPost::published()->count(),
                    ],
                    'contacts' => [
                        'total' => Contact::count(),
                        'new' => Contact::where('status', 'new')->count(),
                    ],
                ];
            }
        );

        return response()->json($data);
    }

    /**
     * Get sales chart data (admin only)
     * Cached for 15 min.
     */
    public function salesChart(Request $request)
    {
        $days = $request->input('days', 30);

        $sales = CacheService::rememberTracked(
            CacheService::PREFIX_STATS,
            "sales_chart_{$days}",
            CacheService::TTL_MODERATE,
            function () use ($days) {
                return Order::where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays($days))
                    ->selectRaw('DATE(created_at) as date, SUM(total_price) as total, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();
            }
        );

        return response()->json($sales);
    }

    /**
     * Get popular phone numbers (admin only)
     * Cached for 15 min.
     */
    public function popularPhoneNumbers()
    {
        $phoneNumbers = CacheService::rememberTracked(
            CacheService::PREFIX_STATS,
            'popular_numbers',
            CacheService::TTL_MODERATE,
            function () {
                return PhoneNumber::with('category')
                    ->orderBy('views_count', 'desc')
                    ->limit(10)
                    ->get();
            }
        );

        return response()->json($phoneNumbers);
    }
}
