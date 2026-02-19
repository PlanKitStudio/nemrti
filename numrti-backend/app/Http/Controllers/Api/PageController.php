<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Display a listing of published pages.
     * Cached for 60 min.
     */
    public function index()
    {
        $pages = CacheService::rememberTracked(
            CacheService::PREFIX_PAGES,
            'published',
            CacheService::TTL_SHORT,
            fn () => Page::where('is_published', true)->orderBy('order', 'asc')->get()
        );

        return response()->json($pages);
    }

    /**
     * Display all pages for admin (including unpublished).
     */
    public function adminIndex()
    {
        $pages = Page::orderBy('order', 'asc')->get();
        return response()->json($pages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug',
            'content' => 'required|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean',
            'order' => 'integer'
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);
        
        CacheService::clearPages();

        return response()->json($page, 201);
    }

    /**
     * Display the specified resource by slug.
     * Cached per slug for 60 min.
     */
    public function show(string $slug)
    {
        $page = CacheService::rememberTracked(
            CacheService::PREFIX_PAGES,
            "slug_{$slug}",
            CacheService::TTL_SHORT,
            fn () => Page::where('slug', $slug)->where('is_published', true)->firstOrFail()
        );

        return response()->json($page);
    }

    /**
     * Display the specified resource by ID for admin.
     */
    public function adminShow($id)
    {
        $page = Page::findOrFail($id);
        return response()->json($page);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:pages,slug,' . $id,
            'content' => 'sometimes|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'boolean',
            'order' => 'integer'
        ]);

        $page->update($validated);

        CacheService::clearPages();
        
        return response()->json($page);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        CacheService::clearPages();
        
        return response()->json(['message' => 'Page deleted successfully']);
    }
}
