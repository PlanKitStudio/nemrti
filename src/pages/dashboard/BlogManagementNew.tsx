import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  BarChart3,
  FileText,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  MoreVertical,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import StatCard from "@/components/dashboard/StatCard";
import BlogEditor from "@/components/dashboard/BlogEditor";
import { getStorageUrl } from "@/lib/api";
import { useAdminBlogPosts, useBlogCategories, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlogPosts";
import Loading from "@/components/Loading";

const BlogManagementNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { data: postsData, isLoading } = useAdminBlogPosts({
    search: searchTerm || undefined,
    category_id: selectedCategory !== "all" ? selectedCategory : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  const { data: categoriesData } = useBlogCategories();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const posts = Array.isArray(postsData) ? postsData : postsData?.data || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const handleAddPost = async (postData: any) => {
    await createPost.mutateAsync(postData);
    setIsEditorOpen(false);
  };

  const handleUpdatePost = async (postData: any) => {
    if (!editingPost) return;
    await updatePost.mutateAsync({ id: editingPost.id, data: postData });
    setEditingPost(null);
    setIsEditorOpen(false);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    await deletePost.mutateAsync(postId);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'scheduled': return 'مجدول';
      default: return status || 'مسودة';
    }
  };

  // Statistics
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p: any) => p.status === 'published').length;
  const draftPosts = posts.filter((p: any) => p.status === 'draft').length;
  const totalViews = posts.reduce((sum: number, p: any) => sum + (p.views_count || 0), 0);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المقالات</h1>
          <p className="text-muted-foreground">إنشاء وإدارة محتوى المدونة</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleNewPost} className="gap-2">
            <Plus className="h-4 w-4" />
            مقال جديد
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المقالات"
          value={totalPosts}
          icon={FileText}
        />
        <StatCard
          title="المنشورة"
          value={publishedPosts}
          icon={TrendingUp}
        />
        <StatCard
          title="المسودات"
          value={draftPosts}
          icon={FileText}
        />
        <StatCard
          title="إجمالي المشاهدات"
          value={totalViews.toLocaleString()}
          icon={BarChart3}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              {post.featured_image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getStorageUrl(post.featured_image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {!post.featured_image && (
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEditPost(post)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          تحرير المقال
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف المقال
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    {post.category?.name || post.blog_categories?.name || 'غير محدد'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.excerpt || (post.content || '').substring(0, 150) + '...'}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  {post.author?.name && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{(post.views_count || 0).toLocaleString()} مشاهدة</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                    className="flex-1"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    تحرير
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد مقالات</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإنشاء أول مقال لك</p>
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="h-4 w-4" />
              إنشاء مقال جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0" aria-describedby={undefined}>
          <VisuallyHidden>
            <DialogTitle>{editingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}</DialogTitle>
          </VisuallyHidden>
          <div className="overflow-y-auto max-h-[90vh] p-6">
            <BlogEditor
              initialData={editingPost}
              onSubmit={editingPost ? handleUpdatePost : handleAddPost}
              onCancel={() => setIsEditorOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagementNew;
