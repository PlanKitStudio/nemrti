<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PhoneNumberResource;
use App\Models\PhoneNumber;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Get user's favorite phone numbers
     */
    public function index(Request $request)
    {
        $favoritePhoneNumberIds = $request->user()
            ->favorites()
            ->pluck('phone_number_id');

        $phoneNumbers = PhoneNumber::whereIn('id', $favoritePhoneNumberIds)
            ->with(['category'])
            ->paginate(15);

        return PhoneNumberResource::collection($phoneNumbers);
    }

    /**
     * Add phone number to favorites
     */
    public function store(Request $request)
    {
        $request->validate([
            'phone_number_id' => ['required', 'uuid', 'exists:phone_numbers,id'],
        ]);

        $phoneNumber = PhoneNumber::findOrFail($request->phone_number_id);

        if (!$request->user()->hasFavorite($phoneNumber->id)) {
            $request->user()->favorites()->create([
                'phone_number_id' => $phoneNumber->id,
            ]);
        }

        return response()->json([
            'message' => 'تمت الإضافة للمفضلة بنجاح',
        ]);
    }

    /**
     * Remove phone number from favorites
     */
    public function destroy(Request $request, PhoneNumber $phoneNumber)
    {
        $request->user()->favorites()
            ->where('phone_number_id', $phoneNumber->id)
            ->delete();

        return response()->json([
            'message' => 'تم الحذف من المفضلة بنجاح',
        ]);
    }

    /**
     * Check if phone number is in favorites
     */
    public function check(Request $request, PhoneNumber $phoneNumber)
    {
        $isFavorite = $request->user()->hasFavorite($phoneNumber->id);

        return response()->json([
            'is_favorite' => $isFavorite,
        ]);
    }
}
