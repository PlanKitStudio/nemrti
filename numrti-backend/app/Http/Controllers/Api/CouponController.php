<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Validate a coupon code (public - for cart)
     */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json([
                'message' => 'كوبون غير موجود',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'message' => 'الكوبون غير صالح أو منتهي الصلاحية',
            ], 422);
        }

        return response()->json([
            'data' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'min_order_amount' => $coupon->min_order_amount,
            ],
            'message' => 'كوبون صالح',
        ]);
    }

    /**
     * Admin: List all coupons
     */
    public function index()
    {
        $coupons = Coupon::latest()->get();

        return response()->json([
            'data' => $coupons,
        ]);
    }

    /**
     * Admin: Create a new coupon
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'is_active' => ['boolean'],
        ]);

        $coupon = Coupon::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_uses' => $request->max_uses,
            'expires_at' => $request->expires_at,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'data' => $coupon,
            'message' => 'تم إنشاء الكوبون بنجاح',
        ], 201);
    }

    /**
     * Admin: Update a coupon
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => ['sometimes', 'string', 'unique:coupons,code,' . $coupon->id],
            'type' => ['sometimes', 'in:percentage,fixed'],
            'value' => ['sometimes', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ]);

        $coupon->update(array_filter([
            'code' => $request->code ? strtoupper($request->code) : null,
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_uses' => $request->max_uses,
            'expires_at' => $request->expires_at,
            'is_active' => $request->has('is_active') ? $request->is_active : null,
        ], fn ($v) => $v !== null));

        return response()->json([
            'data' => $coupon->fresh(),
            'message' => 'تم تحديث الكوبون بنجاح',
        ]);
    }

    /**
     * Admin: Delete a coupon
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return response()->json([
            'message' => 'تم حذف الكوبون بنجاح',
        ]);
    }
}
