import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link2, 
  Image, 
  Quote, 
  Code, 
  Eye,
  Save,
  Upload,
  X,
  Hash
} from "lucide-react";
import { useBlogCategories } from "@/hooks/useBlogPosts";
import { getStorageUrl } from "@/lib/api";

interface BlogEditorProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const BlogEditor = ({ initialData, onSubmit, onCancel }: BlogEditorProps) => {
  const { data: blogCategories } = useBlogCategories();
  const categories = Array.isArray(blogCategories) ? blogCategories : blogCategories?.data || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category_id: initialData?.category_id || initialData?.category?.id || '',
    status: initialData?.status || 'published',
    featured: initialData?.featured || false,
    tags: initialData?.tags?.join(', ') || '',
    seoTitle: initialData?.seo_title || initialData?.seoTitle || '',
    seoDescription: initialData?.seo_description || initialData?.seoDescription || '',
    featuredImage: initialData?.featured_image || initialData?.featuredImage || '',
    readingTime: initialData?.readingTime || 0
  });

  const [isPreview, setIsPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate reading time based on content
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleContentChange = (content: string) => {
    setFormData({ 
      ...formData, 
      content,
      readingTime: calculateReadingTime(content)
    });
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + 
                   before + selectedText + after + 
                   formData.content.substring(end);
    
    handleContentChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    // Store the file for later upload & show local preview
    const imageUrl = URL.createObjectURL(file);
    setImageFile(file);
    setFormData({ ...formData, featuredImage: imageUrl });
    setImageUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.title.toLowerCase().replace(/[\s]+/g, '-').replace(/[^\u0621-\u064Aa-zA-Z0-9-]/g, '');

    // Build FormData to support file upload
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('category_id', formData.category_id);
    submitData.append('status', formData.status);
    submitData.append('slug', slug);
    
    if (formData.seoTitle) {
      submitData.append('seo_title', formData.seoTitle);
    }
    if (formData.seoDescription) {
      submitData.append('seo_description', formData.seoDescription);
    }
    
    if (formData.status === 'published') {
      submitData.append('published_at', new Date().toISOString());
    }

    // Attach image file if a new one was selected
    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (formData.featuredImage && !formData.featuredImage.startsWith('blob:')) {
      // Keep existing image URL
      submitData.append('featured_image', formData.featuredImage);
    }
    
    onSubmit(submitData);
  };

  const formatToolButtons = [
    { icon: Bold, action: () => insertText('**', '**'), label: 'غامق' },
    { icon: Italic, action: () => insertText('*', '*'), label: 'مائل' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), label: 'تحته خط' },
    { icon: List, action: () => insertText('- '), label: 'قائمة' },
    { icon: ListOrdered, action: () => insertText('1. '), label: 'قائمة مرقمة' },
    { icon: Quote, action: () => insertText('> '), label: 'اقتباس' },
    { icon: Code, action: () => insertText('`', '`'), label: 'كود' },
    { icon: Link2, action: () => insertText('[', '](url)'), label: 'رابط' },
    { icon: Hash, action: () => insertText('## '), label: 'عنوان فرعي' }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialData ? 'تحرير المقال' : 'مقال جديد'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {isPreview ? 'تحرير' : 'معاينة'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان المقال *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="أدخل عنوان المقال"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">المقتطف</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="مقتطف قصير عن المقال (يظهر في البحث والشبكات الاجتماعية)"
                rows={3}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.excerpt.length}/160 حرف
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>مقال مميز</Label>
                  <p className="text-xs text-muted-foreground">يظهر في الصفحة الرئيسية</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(featured) => setFormData({ ...formData, featured })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>الصورة الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.featuredImage ? (
                <div className="relative">
                  <img
                    src={getStorageUrl(formData.featuredImage)}
                    alt="صورة المقال"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 left-2"
                    onClick={() => { setFormData({ ...formData, featuredImage: '' }); setImageFile(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">انقر لتحميل صورة أو اسحبها هنا</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                  >
                    {imageUploading ? 'جاري التحميل...' : 'تحميل صورة'}
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              المحتوى *
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>وقت القراءة المتوقع: {formData.readingTime} دقيقة</span>
                <Badge variant="outline">
                  {formData.content.length} حرف
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isPreview ? (
              <div className="space-y-4">
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted/50">
                  {formatToolButtons.map((tool, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={tool.action}
                      title={tool.label}
                      className="h-8 w-8 p-0"
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Textarea
                  ref={contentRef}
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="اكتب محتوى المقال هنا... يمكنك استخدام Markdown للتنسيق"
                  rows={15}
                  required
                  className="font-mono"
                />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none p-4 border rounded-lg min-h-[400px]">
                <h1>{formData.title}</h1>
                <div className="whitespace-pre-wrap">{formData.content}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>الكلمات المفتاحية والتاگز</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="tags">الكلمات المفتاحية</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                مثال: أرقام، تكنولوجيا، اتصالات
              </div>
              
              {formData.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات السيو (SEO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">عنوان السيو</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="عنوان المقال في محركات البحث (اتركه فارغاً لاستخدام العنوان الأصلي)"
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.seoTitle.length}/60 حرف
              </div>
            </div>

            <div>
              <Label htmlFor="seoDescription">وصف السيو</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="وصف المقال في محركات البحث (اتركه فارغاً لاستخدام المقتطف)"
                rows={3}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.seoDescription.length}/160 حرف
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {initialData ? 'تحديث المقال' : 'حفظ المقال'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;