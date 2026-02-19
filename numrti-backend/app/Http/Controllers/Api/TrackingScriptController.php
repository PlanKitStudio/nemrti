<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrackingScript;
use Illuminate\Http\Request;

class TrackingScriptController extends Controller
{
    /**
     * Public: Get active scripts for a specific page
     */
    public function getForPage(Request $request)
    {
        $page = $request->query('page', 'global');

        $scripts = TrackingScript::active()
            ->forPage($page)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('position');

        return response()->json([
            'head' => $scripts->get('head', collect())->pluck('code')->toArray(),
            'body_start' => $scripts->get('body_start', collect())->pluck('code')->toArray(),
            'body_end' => $scripts->get('body_end', collect())->pluck('code')->toArray(),
        ]);
    }

    /**
     * Admin: List all tracking scripts
     */
    public function index()
    {
        $scripts = TrackingScript::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json($scripts);
    }

    /**
     * Admin: Create a new tracking script
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string',
            'page' => 'required|in:global,home,numbers,number_detail,cart,checkout,thank_you,blog,contact,auth',
            'position' => 'required|in:head,body_start,body_end',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $script = TrackingScript::create($validated);

        return response()->json($script, 201);
    }

    /**
     * Admin: Update a tracking script
     */
    public function update(Request $request, TrackingScript $trackingScript)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string',
            'page' => 'sometimes|in:global,home,numbers,number_detail,cart,checkout,thank_you,blog,contact,auth',
            'position' => 'sometimes|in:head,body_start,body_end',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $trackingScript->update($validated);

        return response()->json($trackingScript);
    }

    /**
     * Admin: Delete a tracking script
     */
    public function destroy(TrackingScript $trackingScript)
    {
        $trackingScript->delete();
        return response()->json(['message' => 'تم حذف الكود بنجاح']);
    }
}
