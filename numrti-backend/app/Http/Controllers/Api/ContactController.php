<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message
     */
    public function store(StoreContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        return response()->json([
            'message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
            'data' => $contact,
        ], 201);
    }

    /**
     * Get all contact messages (admin only)
     */
    public function index(Request $request)
    {
        $contacts = Contact::latest()
            ->paginate($request->input('per_page', 20));

        return response()->json($contacts);
    }

    /**
     * Display the specified contact message (admin only)
     */
    public function show(Contact $contact)
    {
        return response()->json($contact);
    }

    /**
     * Update contact status (admin only)
     */
    public function updateStatus(Request $request, Contact $contact)
    {
        $request->validate([
            'status' => ['required', 'in:new,read,replied'],
        ]);

        $contact->update(['status' => $request->status]);

        return response()->json([
            'message' => 'تم تحديث الحالة بنجاح',
            'data' => $contact,
        ]);
    }

    /**
     * Remove the specified contact message (admin only)
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'message' => 'تم حذف الرسالة بنجاح',
        ]);
    }
}
