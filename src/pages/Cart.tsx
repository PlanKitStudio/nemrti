import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useValidateCoupon } from '@/hooks/useCoupons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, ShoppingCart, Phone, Ticket, X, Check, ChevronLeft } from 'lucide-react';
import { fbqTrackInitiateCheckout } from '@/lib/facebook-pixel';

const Cart = () => {
  const { user } = useAuth();
  const { items, removeFromCart, totalPrice, discountAmount, finalPrice, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  
  const validateCoupon = useValidateCoupon();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    validateCoupon.mutate(couponCode.trim(), {
      onSuccess: (data) => {
        const coupon = data.data || data.coupon || data;
        applyCoupon({
          code: coupon.code || couponCode,
          type: coupon.type || 'percentage',
          value: Number(coupon.value),
        });
        setCouponCode('');
      },
    });
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'سجل دخولك لإتمام الطلب',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: 'السلة فارغة',
        description: 'أضف أرقاماً إلى السلة أولاً',
        variant: 'destructive',
      });
      return;
    }

    fbqTrackInitiateCheckout(items.map(i => i.id), finalPrice, items.length);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => navigate('/numbers')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            الأرقام
          </button>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-primary font-semibold">سلة التسوق</span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'رقم' : 'أرقام'} في السلة
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center glass-card animate-fade-in-up">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
            <h2 className="text-xl font-semibold mb-2">السلة فارغة</h2>
            <p className="text-muted-foreground mb-6">
              لم تضف أي أرقام للسلة بعد
            </p>
            <Button onClick={() => navigate('/numbers')} className="bg-gradient-primary">
              تصفح الأرقام
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="p-4 glass-card hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold font-mono dir-ltr">{item.number}</p>
                        {item.provider && (
                          <p className="text-sm text-muted-foreground">{item.provider}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-primary">
                        {item.price.toLocaleString('ar-EG')} ج.م
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Coupon Section */}
              <Card className="p-5 glass-card">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">كوبون الخصم</h3>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-mono font-semibold">{appliedCoupon.code}</span>
                      <Badge variant="secondary">
                        {appliedCoupon.type === 'percentage' 
                          ? `خصم ${appliedCoupon.value}%` 
                          : `خصم ${appliedCoupon.value.toLocaleString('ar-EG')} ج.م`
                        }
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeCoupon} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="أدخل كود الخصم"
                      className="font-mono"
                      dir="ltr"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={validateCoupon.isPending || !couponCode.trim()}
                      variant="outline"
                    >
                      {validateCoupon.isPending ? 'جاري التحقق...' : 'تطبيق'}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 glass-card sticky top-24">
                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الأرقام</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="font-semibold">{totalPrice.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Ticket className="h-3.5 w-3.5" />
                        الخصم ({appliedCoupon.code})
                      </span>
                      <span className="font-semibold">- {discountAmount.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">
                        {finalPrice.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-primary" 
                  size="lg"
                  onClick={handleProceedToCheckout}
                >
                  متابعة الشراء
                  <ChevronLeft className="h-4 w-4 mr-2" />
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
