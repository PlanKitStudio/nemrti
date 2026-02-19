import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { authAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import {
  User, Phone, Mail, ShoppingBag, Save, Loader2,
  ChevronLeft, Calendar, CreditCard,
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  processing: 'قيد التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const paymentLabels: Record<string, string> = {
  cash: 'كاش',
  bank_transfer: 'تحويل بنكي',
  vodafone_cash: 'فودافون كاش',
  instapay: 'إنستاباي',
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const { data: orders, isLoading: ordersLoading } = useOrders();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await authAPI.updateProfile({ name, phone });
      await refreshUser();

      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث معلومات الملف الشخصي',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في التحديث',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
          <Button onClick={() => navigate('/auth')}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  const recentOrders = (orders as any[])?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
          <p className="text-muted-foreground">إدارة معلوماتك الشخصية ومتابعة طلباتك</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Info Card */}
          <Card className="p-6 glass-card">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              المعلومات الشخصية
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    الاسم الكامل
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="font-mono"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-auto bg-gradient-primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Recent Orders Card */}
          <Card className="p-6 glass-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                طلباتي الأخيرة
              </h2>
              {recentOrders.length > 0 && (
                <Link to="/my-orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                  عرض الكل
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground mb-3">لا يوجد طلبات بعد</p>
                <Button variant="outline" onClick={() => navigate('/numbers')}>
                  تصفح الأرقام
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <Link
                    key={order.id}
                    to="/my-orders"
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono font-semibold" dir="ltr">
                            #{order.order_number || order.id?.slice(0, 8)}
                          </p>
                          <Badge className={`text-[10px] px-1.5 py-0 ${statusColors[order.status] || ''}`}>
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString('ar-EG', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                              : '—'}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {paymentLabels[order.payment_method] || order.payment_method}
                          </span>
                          <span>
                            {order.items?.length || 0} رقم
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {Number(order.total_price || 0).toLocaleString('ar-EG')} ج.م
                      </p>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
