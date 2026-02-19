<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CacheService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     * Cached for 60 min — categories rarely change.
     */
    public function index()
    {
        $categories = CacheService::rememberTracked(
            CacheService::PREFIX_CATEGORIES,
            'all_with_count',
            CacheService::TTL_STATIC,
            fn () => Category::withCount('phoneNumbers')->orderBy('name')->get()
        );

        return CategoryResource::collection($categories);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category)
    {
        return new CategoryResource($category->loadCount('phoneNumbers'));
    }

    /**
     * Store a newly created category (admin only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
        ]);

        $category = Category::create($request->all());

        CacheService::clearCategories();

        return new CategoryResource($category);
    }

    /**
     * Update the specified category (admin only)
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:categories,name,' . $category->id],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
        ]);

        $category->update($request->all());

        CacheService::clearCategories();

        return new CategoryResource($category);
    }

    /**
     * Remove the specified category (admin only)
     */
    public function destroy(Category $category)
    {
        $category->delete();

        CacheService::clearCategories();

        return response()->json([
            'message' => 'تم حذف التصنيف بنجاح',
        ]);
    }
}
