import { useState } from "react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Filter
} from "lucide-react";
import { formatPrice, getNetworkName } from "@/lib/helpers";
import { useAdminPhoneNumbers, useCreatePhoneNumber, useUpdatePhoneNumber, useDeletePhoneNumber } from "@/hooks/usePhoneNumbers";
import { useCategories } from "@/hooks/useCategories";
import Loading from "@/components/Loading";

const NumbersManagement = () => {
  const { data: numbers = [], isLoading } = useAdminPhoneNumbers();
  const { data: categories } = useCategories();
  const createNumber = useCreatePhoneNumber();
  const updateNumber = useUpdatePhoneNumber();
  const deleteNumber = useDeletePhoneNumber();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<any | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  // تصفية الأرقام
  const filteredNumbers = numbers?.filter(number => {
    const matchesSearch = number.number.includes(searchTerm) || 
                         (number.pattern_type && number.pattern_type.includes(searchTerm));
    const matchesProvider = selectedProvider === "all" || number.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  }) || [];

  // إضافة رقم جديد
  const handleAddNumber = async (newNumber: any) => {
    await createNumber.mutateAsync({
      number: newNumber.number,
      price: newNumber.price,
      provider: newNumber.provider,
      category_id: newNumber.category_id,
      is_featured: newNumber.is_featured || false,
    });
    setIsAddDialogOpen(false);
  };

  // تحديث رقم
  const handleUpdateNumber = async (updatedNumber: any) => {
    const { id, ...data } = updatedNumber;
    await updateNumber.mutateAsync({
      id,
      data: {
        number: data.number,
        price: data.price,
        provider: data.provider,
        category_id: data.category_id,
        is_featured: data.is_featured || false,
      },
    });
    setEditingNumber(null);
  };

  // حذف رقم
  const handleDeleteNumber = async (id: string) => {
    await deleteNumber.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{numbers.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي الأرقام</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{numbers.filter(n => !n.is_sold).length}</p>
                <p className="text-sm text-muted-foreground">متاح للبيع</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⭐</span>
              <div>
                <p className="text-2xl font-bold">{numbers.filter(n => n.is_featured).length}</p>
                <p className="text-sm text-muted-foreground">مميز</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500">💰</span>
              <div>
                <p className="text-2xl font-bold">{formatPrice(numbers.reduce((sum, n) => sum + n.price, 0))}</p>
                <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحكم */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة الأرقام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن رقم أو نمط..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="مزود الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المزودين</SelectItem>
                <SelectItem value="vodafone">فودافون</SelectItem>
                <SelectItem value="orange">أورانج</SelectItem>
                <SelectItem value="etisalat">اتصالات</SelectItem>
                <SelectItem value="we">WE</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة رقم جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة رقم جديد</DialogTitle>
                  <DialogDescription>أدخل بيانات الرقم الجديد لإضافته إلى القائمة</DialogDescription>
                </DialogHeader>
                <NumberForm onSubmit={handleAddNumber} categories={categories} />
              </DialogContent>
            </Dialog>
          </div>

          {/* جدول الأرقام */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>الشبكة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>النمط</TableHead>
                  <TableHead>المشاهدات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNumbers.map((number) => (
                  <TableRow key={number.id}>
                    <TableCell className="font-mono font-medium">
                      {number.number}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getNetworkName(number.provider) || 'غير محدد'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatPrice(Number(number.price))}</span>
                    </TableCell>
                    <TableCell>{number.pattern_type || '-'}</TableCell>
                    <TableCell>{(number.views_count || 0).toLocaleString('ar-EG')}</TableCell>
                    <TableCell>
                      <Badge variant={!number.is_sold ? "default" : "secondary"}>
                        {!number.is_sold ? "متاح" : "مباع"}
                      </Badge>
                      {number.is_featured && (
                        <Badge variant="outline" className="mr-2">
                          مميز
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNumber(number)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNumber(number.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* نافذة التحرير */}
      {editingNumber && (
        <Dialog open={!!editingNumber} onOpenChange={() => setEditingNumber(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تحرير الرقم</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الرقم</DialogDescription>
            </DialogHeader>
            <NumberForm 
              initialData={editingNumber}
              onSubmit={handleUpdateNumber}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// مكون نموذج إضافة/تحرير الرقم
const NumberForm = ({ 
  initialData, 
  onSubmit,
  categories 
}: { 
  initialData?: any;
  onSubmit: (data: any) => void;
  categories?: any[];
}) => {
  const [formData, setFormData] = useState({
    number: initialData?.number || '',
    price: initialData?.price || 0,
    provider: initialData?.provider || 'vodafone',
    is_featured: initialData?.is_featured || false,
    category_id: initialData?.category_id || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!formData.number || !/^[0-9]{11}$/.test(formData.number)) {
      setError('رقم الهاتف يجب أن يكون 11 رقم فقط (مثل 01012345678)');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('السعر يجب أن يكون أكبر من صفر');
      return;
    }
    if (!formData.category_id) {
      setError('يجب اختيار التصنيف');
      return;
    }
    
    onSubmit(initialData ? { ...initialData, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="number">رقم الهاتف</Label>
        <Input
          id="number"
          value={formData.number}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
            setFormData({ ...formData, number: val });
          }}
          placeholder="01xxxxxxxxx"
          dir="ltr"
          maxLength={11}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">يجب أن يكون 11 رقم (مثل 01012345678)</p>
      </div>
      
      <div>
        <Label htmlFor="price">السعر (ج.م)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          min={0}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="provider">مزود الخدمة</Label>
        <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vodafone">فودافون</SelectItem>
            <SelectItem value="orange">أورانج</SelectItem>
            <SelectItem value="etisalat">اتصالات</SelectItem>
            <SelectItem value="we">WE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">التصنيف</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
        />
        <Label htmlFor="featured">رقم مميز</Label>
      </div>
      
      <Button type="submit" className="w-full">
        {initialData ? 'تحديث' : 'إضافة'} الرقم
      </Button>
    </form>
  );
};

export default NumbersManagement;