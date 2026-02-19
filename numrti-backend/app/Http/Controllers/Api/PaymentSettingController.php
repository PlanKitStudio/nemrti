<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;

class PaymentSettingController extends Controller
{
    /**
     * Public: Get payment settings (for checkout page)
     */
    public function index()
    {
        return response()->json(PaymentSetting::getAllSettings());
    }

    /**
     * Admin: Update payment settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'settings' => ['required', 'array'],
        ]);

        foreach ($request->settings as $key => $value) {
            PaymentSetting::setValue($key, $value);
        }

        return response()->json([
            'message' => 'تم تحديث إعدادات الدفع بنجاح',
            'data' => PaymentSetting::getAllSettings(),
        ]);
    }
}
