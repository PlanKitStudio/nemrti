<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\PhoneNumber;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display user's orders
     */
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.phoneNumber'])
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created order
     */
    public function store(StoreOrderRequest $request)
    {
        $result = DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $items = [];

            // Calculate total and validate availability
            foreach ($request->items as $item) {
                $phoneNumber = PhoneNumber::findOrFail($item['phone_number_id']);
                
                if ($phoneNumber->is_sold) {
                    return response()->json([
                        'message' => 'الرقم ' . $phoneNumber->number . ' غير متاح للبيع',
                    ], 422);
                }

                $quantity = $item['quantity'] ?? 1;
                $price = $phoneNumber->price * $quantity;
                $totalPrice += $price;
                
                $items[] = [
                    'phone_number_id' => $phoneNumber->id,
                    'phone_number' => $phoneNumber->number,
                    'price' => $phoneNumber->price,
                ];
            }

            // Apply coupon discount if provided
            $discountAmount = 0;
            $couponCode = null;
            
            if ($request->coupon_code) {
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();
                
                if ($coupon && $coupon->isValid($totalPrice)) {
                    $discountAmount = $coupon->calculateDiscount($totalPrice);
                    $couponCode = $coupon->code;
                    $coupon->incrementUsage();
                }
            }

            $finalPrice = max(0, $totalPrice - $discountAmount);

            // Create order
            $order = $request->user()->orders()->create([
                'total_price' => $finalPrice,
                'payment_method' => $request->payment_method ?? 'cash',
                'coupon_code' => $couponCode,
                'discount_amount' => $discountAmount,
                'notes' => $request->notes,
                'status' => 'pending',
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_whatsapp' => $request->customer_whatsapp,
                'customer_city' => $request->customer_city,
                'customer_address' => $request->customer_address,
            ]);

            // Create order items
            $order->items()->createMany($items);

            // Mark phone numbers as sold (batch update to avoid N+1)
            $phoneIds = collect($request->items)->pluck('phone_number_id')->toArray();
            PhoneNumber::whereIn('id', $phoneIds)->update(['is_sold' => true]);

            return new OrderResource($order->load(['items.phoneNumber']));
        });

        // Only invalidate caches if order was actually created
        if ($result instanceof OrderResource) {
            CacheService::clearStats();
            CacheService::clearPhones();
            CacheService::clearOrders();
        }

        return $result;
    }

    /**
     * Display the specified order
     */
    public function show(Request $request, Order $order)
    {
        // Check if user owns this order or is admin
        if ($order->user_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            abort(403, 'غير مصرح لك بعرض هذا الطلب');
        }

        return new OrderResource($order->load(['items.phoneNumber']));
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:pending,processing,completed,cancelled'],
        ]);

        $oldStatus = $order->status;
        $newStatus = $request->status;

        $order->update([
            'status' => $newStatus,
        ]);

        // If cancelled, restore phone numbers to available
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->phone_number_id) {
                    PhoneNumber::where('id', $item->phone_number_id)
                        ->update(['is_sold' => false]);
                }
            }
            CacheService::clearPhones();
        }

        // If re-completed from cancelled, mark numbers as sold again
        if (in_array($newStatus, ['completed', 'processing', 'pending']) && $oldStatus === 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->phone_number_id) {
                    PhoneNumber::where('id', $item->phone_number_id)
                        ->update(['is_sold' => true]);
                }
            }
            CacheService::clearPhones();
        }

        CacheService::clearStats();
        CacheService::clearOrders();

        return new OrderResource($order->load(['items.phoneNumber']));
    }

    /**
     * Get all orders (admin only)
     */
    public function all(Request $request)
    {
        $orders = Order::with(['user', 'items.phoneNumber'])
            ->latest()
            ->paginate(100);

        return OrderResource::collection($orders);
    }

    /**
     * Upload payment proof for an order
     */
    public function uploadPaymentProof(Request $request, Order $order)
    {
        // Check ownership
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'غير مصرح');
        }

        $request->validate([
            'payment_proof' => ['required', 'image', 'max:5120'], // 5MB max
        ], [
            'payment_proof.required' => 'يرجى رفع صورة إثبات الدفع',
            'payment_proof.image' => 'الملف يجب أن يكون صورة',
            'payment_proof.max' => 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت',
        ]);

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        $order->update(['payment_proof' => $path]);

        return response()->json([
            'message' => 'تم رفع إثبات الدفع بنجاح',
            'payment_proof' => url('storage/' . $path),
        ]);
    }
}
