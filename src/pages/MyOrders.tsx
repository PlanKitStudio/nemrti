import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ShoppingBag, Phone, Ticket } from 'lucide-react';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading, error } = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
          <Button onClick={() => navigate('/auth')}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      cancelled: "destructive",
    };
    
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      processing: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغي",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'الدفع عند الاستلام',
      bank_transfer: 'تحويل بنكي',
      vodafone_cash: 'فودافون كاش',
      instapay: 'إنستاباي',
    };
    return labels[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">طلباتي</h1>
          <p className="text-muted-foreground">تتبع حالة طلباتك</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card className="p-12 text-center glass-card">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
            <p className="text-muted-foreground mb-6">
              لم تقم بإنشاء أي طلب بعد
            </p>
            <Button onClick={() => navigate('/numbers')}>
              تصفح الأرقام
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="p-6 glass-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono text-sm font-bold mb-1">
                      #{order.order_number || order.id?.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {order.created_at && format(new Date(order.created_at), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                    </p>
                    {/* Show items if available */}
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="text-lg font-bold font-mono dir-ltr">
                              {item.phone_number || item.phone_number_id}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({Number(item.price).toLocaleString('ar-EG')} ج.م)
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Fallback for single number orders */
                      <div className="flex items-center gap-3 mt-1">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold font-mono dir-ltr">
                          {order.phone_number}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    {getStatusBadge(order.status)}
                    <p className="text-2xl font-bold text-primary mt-2">
                      {Number(order.total_price || order.price).toLocaleString('ar-EG')} ج.م
                    </p>
                  </div>
                </div>

                {/* Coupon discount info */}
                {order.coupon_code && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                    <Ticket className="h-4 w-4" />
                    <span>كوبون: {order.coupon_code}</span>
                    {order.discount_amount && (
                      <span>(خصم {Number(order.discount_amount).toLocaleString('ar-EG')} ج.م)</span>
                    )}
                  </div>
                )}

                {order.payment_method && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">طريقة الدفع:</span> {getPaymentMethodLabel(order.payment_method)}
                  </div>
                )}

                {order.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">ملاحظات:</span> {order.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
