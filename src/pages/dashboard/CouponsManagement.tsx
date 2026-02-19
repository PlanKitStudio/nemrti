import { useState } from 'react';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useCoupons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Ticket, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CouponsManagement = () => {
  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_order_amount: '',
      max_uses: '',
      expires_at: '',
      is_active: true,
    });
  };

  const handleCreate = () => {
    createCoupon.mutate({
      ...formData,
      value: Number(formData.value),
      min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? Number(formData.max_uses) : null,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
      },
    });
  };

  const handleEdit = (coupon: any) => {
    setEditId(coupon.id);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      min_order_amount: coupon.min_order_amount ? String(coupon.min_order_amount) : '',
      max_uses: coupon.max_uses ? String(coupon.max_uses) : '',
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      is_active: coupon.is_active,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateCoupon.mutate({
      id: editId,
      data: {
        ...formData,
        value: Number(formData.value),
        min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
      },
    }, {
      onSuccess: () => {
        setIsEditOpen(false);
        resetForm();
        setEditId(null);
      },
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: 'تم نسخ الكوبون' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const couponsList = Array.isArray(coupons) ? coupons : [];

  const renderCouponForm = (onSubmit: () => void, submitting: boolean) => (
    <div className="space-y-4">
      <div>
        <Label>كود الكوبون</Label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
          placeholder="مثال: SAVE20"
          className="font-mono"
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>نوع الخصم</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
              <SelectItem value="fixed">مبلغ ثابت (ج.م)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>القيمة</Label>
          <Input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder={formData.type === 'percentage' ? '20' : '100'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الحد الأدنى للطلب (اختياري)</Label>
          <Input
            type="number"
            value={formData.min_order_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: e.target.value }))}
            placeholder="0"
          />
        </div>
        <div>
          <Label>الحد الأقصى للاستخدام (اختياري)</Label>
          <Input
            type="number"
            value={formData.max_uses}
            onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
            placeholder="غير محدود"
          />
        </div>
      </div>

      <div>
        <Label>تاريخ الانتهاء (اختياري)</Label>
        <Input
          type="date"
          value={formData.expires_at}
          onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label>فعال</Label>
      </div>

      <Button onClick={onSubmit} disabled={submitting || !formData.code || !formData.value} className="w-full">
        {submitting ? 'جاري الحفظ...' : 'حفظ'}
      </Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">إدارة الكوبونات</h1>
          <p className="text-muted-foreground text-sm">إنشاء وإدارة أكواد الخصم</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء كوبون
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>إنشاء كوبون جديد</DialogTitle>
            </DialogHeader>
            {renderCouponForm(handleCreate, createCoupon.isPending)}
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent dir="rtl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>تعديل الكوبون</DialogTitle>
          </DialogHeader>
            {renderCouponForm(handleUpdate, updateCoupon.isPending)}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
      ) : couponsList.length === 0 ? (
        <Card className="p-12 text-center glass-card">
          <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">لا توجد كوبونات</h2>
          <p className="text-muted-foreground mb-6">أنشئ كوبون خصم لعملائك</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {couponsList.map((coupon: any) => (
            <Card key={coupon.id} className="p-5 glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold font-mono" dir="ltr">{coupon.code}</span>
                      <button onClick={() => handleCopyCode(coupon.code)} className="text-muted-foreground hover:text-primary">
                        {copiedCode === coupon.code ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                        {coupon.is_active ? 'فعال' : 'معطل'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        خصم: {coupon.type === 'percentage' ? `${coupon.value}%` : `${Number(coupon.value).toLocaleString('ar-EG')} ج.م`}
                      </span>
                      {coupon.min_order_amount && (
                        <span>الحد الأدنى: {Number(coupon.min_order_amount).toLocaleString('ar-EG')} ج.م</span>
                      )}
                      <span>
                        الاستخدام: {coupon.used_count || 0}{coupon.max_uses ? `/${coupon.max_uses}` : ''}
                      </span>
                      {coupon.expires_at && (
                        <span>
                          ينتهي: {new Date(coupon.expires_at).toLocaleDateString('ar-EG')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(coupon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteCoupon.mutate(coupon.id)}
                    disabled={deleteCoupon.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;
