<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts
     * Cached per filter combo for 5 min.
     */
    public function index(Request $request)
    {
        $cacheKey = 'list_' . md5(json_encode($request->all()));

        $posts = CacheService::rememberTracked(
            CacheService::PREFIX_BLOG,
            $cacheKey,
            CacheService::TTL_DYNAMIC,
            function () use ($request) {
                $query = BlogPost::with(['author', 'category'])
                    ->published()
                    ->latest('published_at');

                if ($request->has('category_id')) {
                    $query->where('category_id', $request->category_id);
                }

                if ($request->has('search')) {
                    $query->where(function ($q) use ($request) {
                        $q->where('title', 'like', '%' . $request->search . '%')
                          ->orWhere('content', 'like', '%' . $request->search . '%');
                    });
                }

                return $query->paginate($request->input('per_page', 10));
            }
        );

        return BlogPostResource::collection($posts);
    }

    /**
     * Display all blog posts for admin (including drafts).
     */
    public function adminIndex(Request $request)
    {
        $query = BlogPost::with(['author', 'category'])
            ->latest('created_at');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        $posts = $query->paginate($request->input('per_page', 50));

        return BlogPostResource::collection($posts);
    }

    /**
     * Store a newly created blog post (admin only)
     */
    public function store(StoreBlogPostRequest $request)
    {
        $data = $request->validated();
        
        // Handle image file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog', 'public');
            $data['featured_image'] = '/storage/' . $path;
        }
        unset($data['image']);

        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['title']);
        }
        
        // Set published_at when status is published
        if (($data['status'] ?? 'draft') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = $request->user()->blogPosts()->create($data);

        CacheService::clearBlog();
        CacheService::clearStats();

        return new BlogPostResource($post->load(['author', 'category']));
    }

    /**
     * Display the specified blog post
     */
    public function show(BlogPost $blogPost)
    {
        return new BlogPostResource($blogPost->load(['author', 'category']));
    }

    /**
     * Display the specified blog post by slug
     */
    public function showBySlug(string $slug)
    {
        $blogPost = BlogPost::where('slug', $slug)
            ->with(['author', 'category'])
            ->published()
            ->firstOrFail();

        // Debounce view count per IP
        $viewKey = "blog_view:{$blogPost->id}:" . request()->ip();
        if (!Cache::has($viewKey)) {
            $blogPost->increment('views_count');
            Cache::put($viewKey, true, CacheService::TTL_DYNAMIC);
        }

        return new BlogPostResource($blogPost);
    }

    /**
     * Get all blog categories
     * Cached for 60 min.
     */
    public function categories()
    {
        $categories = CacheService::rememberTracked(
            CacheService::PREFIX_BLOG,
            'categories',
            CacheService::TTL_STATIC,
            fn () => \App\Models\BlogCategory::all()
        );

        return response()->json(['data' => $categories]);
    }

    /**
     * Update the specified blog post (admin only)
     */
    public function update(StoreBlogPostRequest $request, BlogPost $blogPost)
    {
        $data = $request->validated();

        // Handle image file upload — delete old file if replacing
        if ($request->hasFile('image')) {
            if ($blogPost->featured_image && str_starts_with($blogPost->featured_image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $blogPost->featured_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('blog', 'public');
            $data['featured_image'] = '/storage/' . $path;
        }
        unset($data['image']);
        
        // Set published_at when status changes to published
        if (($data['status'] ?? null) === 'published' && !$blogPost->published_at) {
            $data['published_at'] = now();
        }

        $blogPost->update($data);

        CacheService::clearBlog();
        CacheService::clearStats();

        return new BlogPostResource($blogPost->load(['author', 'category']));
    }

    /**
     * Remove the specified blog post (admin only)
     */
    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        CacheService::clearBlog();
        CacheService::clearStats();

        return response()->json([
            'message' => 'تم حذف المقال بنجاح',
        ]);
    }
}
