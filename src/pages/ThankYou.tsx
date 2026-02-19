import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2, Phone, User, MapPin, CreditCard, Package,
  ArrowLeft, ShoppingBag, Copy, Check,
} from 'lucide-react';
import { useState } from 'react';

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'الدفع عند الاستلام',
  vodafone_cash: 'فودافون كاش',
  instapay: 'إنستاباي',
  bank_transfer: 'تحويل بنكي',
};

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const state = location.state as {
    orderId?: string;
    orderData?: any;
    customerInfo?: any;
    paymentMethod?: string;
    items?: any[];
    totalPrice?: number;
    discountAmount?: number;
    finalPrice?: number;
    couponCode?: string;
  } | null;

  // If no state, redirect
  if (!state?.orderId) {
    return (
      <div className="min-h-screen bg-gradient-hero" dir="rtl">
        <Navbar />
        <main className="container mx-auto px-4 py-8 mt-20 max-w-2xl text-center">
          <Card className="p-12 glass-card">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">لا يوجد طلب</h2>
            <p className="text-muted-foreground mb-6">لم يتم العثور على بيانات الطلب</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/')}>الصفحة الرئيسية</Button>
              <Button variant="outline" onClick={() => navigate('/my-orders')}>طلباتي</Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    orderId,
    orderData,
    customerInfo,
    paymentMethod = 'cash',
    items = [],
    totalPrice = 0,
    discountAmount = 0,
    finalPrice = 0,
    couponCode,
  } = state;

  const orderNumber = orderData?.order_number || orderId?.slice(0, 8) || '—';

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">تم إنشاء طلبك بنجاح!</h1>
          <p className="text-muted-foreground">
            شكراً لك — سيتم التواصل معك قريباً لتأكيد الطلب
          </p>
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Order Number */}
          <Card className="p-5 glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">رقم الطلب</p>
                <p className="text-2xl font-bold font-mono tracking-wider" dir="ltr">
                  #{orderNumber}
                </p>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="نسخ رقم الطلب"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              قيد المراجعة
            </Badge>
          </Card>

          {/* Items */}
          <Card className="p-5 glass-card">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              الأرقام المطلوبة
            </h3>
            <div className="space-y-2">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <span className="font-mono" dir="ltr">{item.number}</span>
                  <span className="font-semibold text-sm">{item.price?.toLocaleString('ar-EG')} ج.م</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع</span>
                <span>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>خصم {couponCode && `(${couponCode})`}</span>
                  <span>- {discountAmount.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold">
                <span>الإجمالي</span>
                <span className="text-primary">{finalPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>
          </Card>

          {/* Customer Info */}
          {customerInfo && (
            <Card className="p-5 glass-card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                بيانات التواصل
              </h3>
              <div className="space-y-2 text-sm">
                <InfoLine label="الاسم" value={customerInfo.customer_name} />
                <InfoLine label="الموبايل" value={customerInfo.customer_phone} mono />
                {customerInfo.customer_whatsapp && (
                  <InfoLine label="واتساب" value={customerInfo.customer_whatsapp} mono />
                )}
                {customerInfo.customer_city && (
                  <InfoLine label="المدينة" value={customerInfo.customer_city} />
                )}
                {customerInfo.customer_address && (
                  <InfoLine label="العنوان" value={customerInfo.customer_address} />
                )}
              </div>
            </Card>
          )}

          {/* Payment Method */}
          <Card className="p-5 glass-card">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              طريقة الدفع
            </h3>
            <p className="text-sm">{PAYMENT_LABELS[paymentMethod] || paymentMethod}</p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-gradient-primary"
              onClick={() => navigate('/my-orders')}
            >
              <ShoppingBag className="h-4 w-4 ml-2" />
              متابعة طلباتي
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              تصفح أرقام أخرى
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function InfoLine({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? 'font-mono' : ''}`} dir={mono ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}

export default ThankYou;
