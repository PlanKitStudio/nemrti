<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhoneNumberRequest;
use App\Http\Requests\UpdatePhoneNumberRequest;
use App\Http\Resources\PhoneNumberResource;
use App\Models\PhoneNumber;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PhoneNumberController extends Controller
{
    /**
     * Display a listing of phone numbers with filters
     * Cached per unique filter combination for 5 min.
     */
    public function index(Request $request)
    {
        $cacheKey = 'list_' . md5(json_encode($request->all()));

        $phoneNumbers = CacheService::rememberTracked(
            CacheService::PREFIX_PHONES,
            $cacheKey,
            CacheService::TTL_DYNAMIC,
            function () use ($request) {
                $query = PhoneNumber::with(['category'])
                    ->filter($request->all());

                if ($request->boolean('featured_only')) {
                    $query->featured();
                }

                if ($request->has('provider')) {
                    $query->byProvider($request->provider);
                }

                if ($request->has('min_price') || $request->has('max_price')) {
                    $query->priceRange(
                        $request->input('min_price', 0),
                        $request->input('max_price', PHP_FLOAT_MAX)
                    );
                }

                return $query->paginate($request->input('per_page', 15));
            }
        );

        return PhoneNumberResource::collection($phoneNumbers);
    }

    /**
     * Store a newly created phone number
     */
    public function store(StorePhoneNumberRequest $request)
    {
        $phoneNumber = PhoneNumber::create($request->validated());

        CacheService::clearPhones();
        CacheService::clearStats();
        CacheService::clearCategories(); // phone count per category changes

        return new PhoneNumberResource($phoneNumber->load('category'));
    }

    /**
     * Display the specified phone number
     * View count is debounced — only increments once per IP per 5 min.
     */
    public function show(Request $request, PhoneNumber $phoneNumber)
    {
        $ip = $request->ip();
        $viewKey = "phone_view:{$phoneNumber->id}:{$ip}";

        if (!Cache::has($viewKey)) {
            $phoneNumber->incrementViews();
            Cache::put($viewKey, true, CacheService::TTL_DYNAMIC);
        }

        return new PhoneNumberResource($phoneNumber->load('category'));
    }

    /**
     * Update the specified phone number
     */
    public function update(UpdatePhoneNumberRequest $request, PhoneNumber $phoneNumber)
    {
        $phoneNumber->update($request->validated());

        CacheService::clearPhones();
        CacheService::clearStats();

        return new PhoneNumberResource($phoneNumber->load('category'));
    }

    /**
     * Remove the specified phone number
     */
    public function destroy(PhoneNumber $phoneNumber)
    {
        $phoneNumber->delete();

        CacheService::clearPhones();
        CacheService::clearStats();
        CacheService::clearCategories();

        return response()->json([
            'message' => 'تم حذف الرقم بنجاح',
        ]);
    }

    /**
     * Get featured phone numbers
     * Cached for 15 min.
     */
    public function featured()
    {
        $phoneNumbers = CacheService::rememberTracked(
            CacheService::PREFIX_PHONES,
            'featured',
            CacheService::TTL_MODERATE,
            fn () => PhoneNumber::with(['category'])->featured()->limit(10)->get()
        );

        return PhoneNumberResource::collection($phoneNumbers);
    }
}
