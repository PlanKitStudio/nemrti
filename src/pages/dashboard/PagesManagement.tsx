import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useAdminPages, useCreatePage, useUpdatePage, useDeletePage } from "@/hooks/usePages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import type { Page } from "@/hooks/usePages";

const PagesManagement = () => {
  const { data: pages = [], isLoading } = useAdminPages();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    is_published: true,
    order: 0
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      meta_description: "",
      is_published: true,
      order: 0
    });
    setEditingPage(null);
  };

  const handleOpenDialog = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_description: page.meta_description || "",
        is_published: page.is_published,
        order: page.order
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPage) {
        await updatePage.mutateAsync({ id: editingPage.id, ...formData });
        toast({
          title: "تم التحديث",
          description: "تم تحديث الصفحة بنجاح"
        });
      } else {
        await createPage.mutateAsync(formData);
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء الصفحة بنجاح"
        });
      }
      handleCloseDialog();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.response?.data?.message || "حدث خطأ أثناء حفظ الصفحة"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصفحة؟")) return;

    try {
      await deletePage.mutateAsync(id);
      toast({
        title: "تم الحذف",
        description: "تم حذف الصفحة بنجاح"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.response?.data?.message || "حدث خطأ أثناء الحذف"
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الصفحات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة صفحات السياسات والمعلومات
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-primary">
              <Plus className="h-4 w-4 ml-2" />
              إضافة صفحة جديدة
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? "تعديل الصفحة" : "إضافة صفحة جديدة"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الصفحة *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">الرابط (Slug) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="privacy-policy"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">وصف تعريفي (Meta Description)</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">المحتوى (HTML) *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  يمكنك استخدام HTML لتنسيق المحتوى
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">الترتيب</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-8">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">منشور</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-gradient-primary" disabled={createPage.isPending || updatePage.isPending}>
                  {editingPage ? "تحديث" : "إنشاء"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    {page.is_published ? (
                      <Badge variant="default" className="bg-primary">
                        <Eye className="h-3 w-3 ml-1" />
                        منشور
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 ml-1" />
                        مسودة
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    /page/{page.slug}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(page)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm">
                {page.meta_description && (
                  <p className="text-muted-foreground line-clamp-2">
                    {page.meta_description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>الترتيب: {page.order}</span>
                  <span>•</span>
                  <span>آخر تحديث: {new Date(page.updated_at).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد صفحات</h3>
            <p className="text-muted-foreground mb-6">ابدأ بإنشاء صفحة جديدة</p>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-primary">
              <Plus className="h-4 w-4 ml-2" />
              إضافة صفحة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PagesManagement;
