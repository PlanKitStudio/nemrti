import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Megaphone,
  BarChart3,
  MousePointer,
  Loader2,
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from "lucide-react";
import { useAdminAds, useCreateAd, useUpdateAd, useDeleteAd } from "@/hooks/useAds";
import { getStorageUrl } from "@/lib/api";

// Backend returns snake_case fields
interface AdRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  target_url: string;
  position: string;
  size: string;
  is_active: boolean;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  impressions_count: number;
  clicks_count: number;
  conversions_count: number;
  priority: number;
  ctr: number;
  conversion_rate: number;
  created_at: string;
}

interface PaginatedResponse {
  data: AdRecord[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const positionNames: Record<string, string> = {
  'home-mid': 'وسط الرئيسية',
  'numbers-header': 'أعلى صفحة الأرقام',
  'numbers-inline': 'بين الأرقام',
  'numbers-footer': 'أسفل صفحة الأرقام',
  'blog-header': 'أعلى المدونة',
  'blog-inline': 'بين المقالات',
  'blog-footer': 'أسفل المدونة',
  header: 'رأس الصفحة',
  sidebar: 'الشريط الجانبي',
  footer: 'أسفل الصفحة',
  inline: 'داخل المحتوى',
};

const AdsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Real API hooks — now paginated
  const { data: paginatedData, isLoading, isError } = useAdminAds({
    position: selectedPosition !== "all" ? selectedPosition : undefined,
    search: searchTerm || undefined,
    page: currentPage,
    per_page: 20,
  });

  // Handle both paginated response and flat array (backward compat)
  const isPaginated = paginatedData && 'data' in paginatedData && 'last_page' in paginatedData;
  const ads: AdRecord[] = isPaginated ? (paginatedData as PaginatedResponse).data : (paginatedData || []);
  const pagination = isPaginated ? paginatedData as PaginatedResponse : null;

  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();

  // Build FormData for file upload support
  const buildFormData = (formData: Record<string, any>): FormData | Record<string, any> => {
    // Only use FormData if there's a file
    if (!formData.imageFile) {
      return {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.imageUrl || null,
        target_url: formData.targetUrl,
        position: formData.position,
        size: formData.size,
        is_active: formData.isActive,
        budget: formData.budget || null,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        priority: formData.priority || 0,
      };
    }

    const fd = new FormData();
    fd.append('title', formData.title);
    if (formData.description) fd.append('description', formData.description);
    fd.append('image', formData.imageFile);
    fd.append('target_url', formData.targetUrl);
    fd.append('position', formData.position);
    fd.append('size', formData.size);
    fd.append('is_active', formData.isActive ? '1' : '0');
    if (formData.budget) fd.append('budget', String(formData.budget));
    if (formData.startDate) fd.append('start_date', formData.startDate);
    if (formData.endDate) fd.append('end_date', formData.endDate);
    fd.append('priority', String(formData.priority || 0));
    return fd;
  };

  // إضافة إعلان جديد
  const handleAddAd = (formData: Record<string, any>) => {
    createAd.mutate(buildFormData(formData), {
      onSuccess: () => setIsAddDialogOpen(false),
    });
  };

  // تحديث إعلان
  const handleUpdateAd = (formData: Record<string, any>) => {
    if (!editingAd) return;
    updateAd.mutate({
      id: editingAd.id,
      data: buildFormData(formData),
    }, {
      onSuccess: () => setEditingAd(null),
    });
  };

  // حذف إعلان
  const handleDeleteAd = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      deleteAd.mutate(id);
    }
  };

  // Compute summary stats from fetched data
  const totalAds = pagination?.total || ads.length;
  const activeAds = ads.filter((ad: AdRecord) => ad.is_active).length;
  const totalImpressions = ads.reduce((sum: number, ad: AdRecord) => sum + (ad.impressions_count || 0), 0);
  const totalClicks = ads.reduce((sum: number, ad: AdRecord) => sum + (ad.clicks_count || 0), 0);
  const totalConversions = ads.reduce((sum: number, ad: AdRecord) => sum + (ad.conversions_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalAds}</p>
                <p className="text-sm text-muted-foreground">إجمالي الإعلانات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{activeAds}</p>
                <p className="text-sm text-muted-foreground">نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalImpressions.toLocaleString('ar-EG')}</p>
                <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString('ar-EG')}</p>
                <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalConversions.toLocaleString('ar-EG')}</p>
                <p className="text-sm text-muted-foreground">إجمالي التحويلات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحكم */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة الإعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن إعلان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الموقع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواقع</SelectItem>
                <SelectItem value="home-mid">وسط الرئيسية</SelectItem>
                <SelectItem value="numbers-header">أعلى صفحة الأرقام</SelectItem>
                <SelectItem value="numbers-inline">بين الأرقام</SelectItem>
                <SelectItem value="numbers-footer">أسفل صفحة الأرقام</SelectItem>
                <SelectItem value="blog-header">أعلى المدونة</SelectItem>
                <SelectItem value="blog-inline">بين المقالات</SelectItem>
                <SelectItem value="blog-footer">أسفل المدونة</SelectItem>
                <SelectItem value="header">رأس الصفحة (عام)</SelectItem>
                <SelectItem value="sidebar">الشريط الجانبي (عام)</SelectItem>
                <SelectItem value="footer">أسفل الصفحة (عام)</SelectItem>
                <SelectItem value="inline">داخل المحتوى (عام)</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة إعلان جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إضافة إعلان جديد</DialogTitle>
                </DialogHeader>
                <AdForm onSubmit={handleAddAd} isSubmitting={createAd.isPending} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Loading / Error states */}
          {isLoading && (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>جاري تحميل الإعلانات...</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-12 gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>حدث خطأ في تحميل الإعلانات</span>
            </div>
          )}

          {/* جدول الإعلانات */}
          {!isLoading && !isError && (
            <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>المقاس</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>النقرات</TableHead>
                    <TableHead>التحويلات</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>الأولوية</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        لا توجد إعلانات حتى الآن
                      </TableCell>
                    </TableRow>
                  ) : (
                    ads.map((ad: AdRecord) => (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {ad.image_url && (
                              <img src={ad.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                            )}
                            <div>
                              <p className="font-medium">{ad.title}</p>
                              {ad.description && (
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {ad.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {positionNames[ad.position] || ad.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{ad.size}</Badge>
                        </TableCell>
                        <TableCell>{(ad.impressions_count || 0).toLocaleString('ar-EG')}</TableCell>
                        <TableCell>{(ad.clicks_count || 0).toLocaleString('ar-EG')}</TableCell>
                        <TableCell>{(ad.conversions_count || 0).toLocaleString('ar-EG')}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            ad.ctr > 3 ? 'text-green-600' : 
                            ad.ctr > 1 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {ad.ctr?.toFixed(2) || '0.00'}%
                          </span>
                        </TableCell>
                        <TableCell>{ad.priority}</TableCell>
                        <TableCell>
                          <Badge variant={ad.is_active ? "default" : "secondary"}>
                            {ad.is_active ? "نشط" : "متوقف"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingAd(ad)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deleteAd.isPending}
                              onClick={() => handleDeleteAd(ad.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  عرض {ads.length} من {pagination.total} إعلان — صفحة {pagination.current_page} من {pagination.last_page}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page <= 1}
                    onClick={() => setCurrentPage(pagination.current_page - 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page >= pagination.last_page}
                    onClick={() => setCurrentPage(pagination.current_page + 1)}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
          )}
        </CardContent>
      </Card>

      {/* نافذة التحرير */}
      {editingAd && (
        <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تحرير الإعلان</DialogTitle>
            </DialogHeader>
            <AdForm 
              initialData={editingAd}
              onSubmit={handleUpdateAd}
              isSubmitting={updateAd.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// ─── Ad Form Component ──────────────────────────────────────

const AdForm = ({ 
  initialData, 
  onSubmit,
  isSubmitting = false,
}: { 
  initialData?: AdRecord;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.image_url || '',
    targetUrl: initialData?.target_url || '',
    position: initialData?.position || 'header',
    size: initialData?.size || '728x90',
    isActive: initialData?.is_active ?? true,
    budget: initialData?.budget || 0,
    startDate: initialData?.start_date?.split('T')[0] || '',
    endDate: initialData?.end_date?.split('T')[0] || '',
    priority: initialData?.priority || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ? getStorageUrl(initialData.image_url) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' }); // clear URL if uploading file
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageFile });
  };

  const sizeOptions: Record<string, string[]> = {
    'home-mid': ['728x90', '970x90', '970x250'],
    'numbers-header': ['728x90', '970x90', '970x250'],
    'numbers-inline': ['728x90', '300x250', '970x90'],
    'numbers-footer': ['728x90', '970x90', '970x250'],
    header: ['728x90', '970x90', '970x250'],
    sidebar: ['300x250', '300x600', '160x600'],
    footer: ['728x90', '970x90', '970x250'],
    inline: ['728x90', '300x250', '970x90'],
    'blog-header': ['728x90', '970x90', '970x250'],
    'blog-inline': ['728x90', '300x250', '970x90'],
    'blog-footer': ['728x90', '970x90', '970x250'],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">عنوان الإعلان</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">وصف الإعلان</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      
      <div>
        <Label>صورة الإعلان</Label>
        <div className="space-y-3">
          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="معاينة" className="max-h-32 mx-auto rounded object-contain" />
                <p className="text-xs text-gray-500 mt-2">اضغط لتغيير الصورة</p>
              </div>
            ) : (
              <div className="py-4">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">اضغط لرفع صورة</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WEBP - حد أقصى 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Fallback URL input */}
          {!imageFile && (
            <div>
              <Label htmlFor="imageUrl" className="text-xs text-gray-500">أو أدخل رابط الصورة</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImagePreview(e.target.value || null);
                }}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="targetUrl">رابط الهدف</Label>
        <Input
          id="targetUrl"
          value={formData.targetUrl}
          onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">موقع الإعلان</Label>
          <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home-mid">وسط الرئيسية</SelectItem>
              <SelectItem value="numbers-header">أعلى صفحة الأرقام</SelectItem>
              <SelectItem value="numbers-inline">بين الأرقام</SelectItem>
              <SelectItem value="numbers-footer">أسفل صفحة الأرقام</SelectItem>
              <SelectItem value="blog-header">أعلى المدونة</SelectItem>
              <SelectItem value="blog-inline">بين المقالات</SelectItem>
              <SelectItem value="blog-footer">أسفل المدونة</SelectItem>
              <SelectItem value="header">رأس الصفحة (عام)</SelectItem>
              <SelectItem value="sidebar">الشريط الجانبي (عام)</SelectItem>
              <SelectItem value="footer">أسفل الصفحة (عام)</SelectItem>
              <SelectItem value="inline">داخل المحتوى (عام)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="size">مقاس الإعلان</Label>
          <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(sizeOptions[formData.position] || ['728x90']).map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">تاريخ البدء</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">تاريخ الانتهاء</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget">الميزانية (ج.م)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="priority">الأولوية (أعلى = أهم)</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="active">إعلان نشط</Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
        {initialData ? 'تحديث' : 'إضافة'} الإعلان
      </Button>
    </form>
  );
};

export default AdsManagement;
