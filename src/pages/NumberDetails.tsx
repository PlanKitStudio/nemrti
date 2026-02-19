import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePhoneNumber } from '@/hooks/usePhoneNumbers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SkeletonDetail } from '@/components/Skeleton';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { fbqTrackViewContent, fbqTrackAddToCart } from '@/lib/facebook-pixel';
import { ArrowRight, Phone, DollarSign, Wifi, Star, ShoppingCart, Heart } from 'lucide-react';

const NumberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: number, isLoading, error } = usePhoneNumber(id || '');
  const { data: isFavorite = false } = useCheckFavorite(user && id ? id : '');
  const { toggle: toggleFavorite, isPending: isFavPending } = useToggleFavorite();

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'سجل دخولك لإضافة الأرقام للمفضلة',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    if (id) {
      await toggleFavorite(id, isFavorite);
    }
  };

  const handleAddToCart = () => {
    if (!number) return;
    addToCart({
      id: number.id,
      number: number.number,
      price: Number(number.price),
      provider: number.provider,
    });
    fbqTrackAddToCart(number.id, number.number, Number(number.price));
  };

  // Track ViewContent when number data loads
  useEffect(() => {
    if (number) {
      fbqTrackViewContent(number.id, number.number, Number(number.price));
    }
  }, [number]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <SkeletonDetail />
      </main>
      <Footer />
    </div>
  );
  if (!number) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">الرقم غير موجود</h1>
          <Button onClick={() => navigate('/numbers')}>
            العودة للأرقام
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/numbers')}
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للأرقام
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 glass-card">
            <div className="text-center mb-6">
              <Phone className="h-20 w-20 mx-auto mb-4 text-primary" />
              <h1 className="text-4xl font-bold mb-2 font-arabic tracking-wider">
                {number.number}
              </h1>
              {number.is_featured && (
                <Badge className="mb-2">
                  <Star className="h-3 w-3 ml-1" />
                  رقم مميز
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">السعر</span>
                <span className="text-2xl font-bold text-primary">
                  {Number(number.price).toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              {number.provider && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">المزود</span>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="font-semibold">{number.provider}</span>
                  </div>
                </div>
              )}

              {number.category && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">الفئة</span>
                  <span className="font-semibold">{number.category.name}</span>
                </div>
              )}

              {number.pattern_type && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">نوع النمط</span>
                  <span className="font-semibold">{number.pattern_type}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">الحالة</span>
                <Badge variant={number.is_sold ? "destructive" : "default"}>
                  {number.is_sold ? 'مباع' : 'متاح'}
                </Badge>
              </div>
            </div>

            {!number.is_sold && (
              <div className="flex gap-3 mt-6">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  أضف للسلة
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleFavorite}
                  disabled={isFavPending}
                  className={`px-4 ${isFavorite ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-bold mb-4">وصف الرقم</h2>
              <p className="text-muted-foreground leading-relaxed">
                {number.description || 'رقم مميز وسهل الحفظ، مناسب للأعمال والاستخدام الشخصي.'}
              </p>
            </Card>

            <Card className="p-6 glass-card">
              <h2 className="text-xl font-bold mb-4">مميزات الرقم</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">رقم مصري أصلي 100%</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">سهل الحفظ والتذكر</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">جاهز للنقل الفوري</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">ضمان 100% على صحة الرقم</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">دعم فني مجاني بعد الشراء</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">إمكانية الاسترجاع خلال 24 ساعة</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 glass-card bg-gradient-primary/10 border-primary/20">
              <h2 className="text-xl font-bold mb-4 text-foreground">💰 عرض خاص</h2>
              <p className="text-muted-foreground mb-4">
                اشتري الآن واحصل على خصم 10% على رقمك القادم!
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                <Star className="h-4 w-4" />
                <span>عرض محدود لفترة قصيرة</span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NumberDetails;
