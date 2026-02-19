import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useRemoveFavorite } from '@/hooks/useFavorites';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { Heart, ShoppingCart, Phone, Eye, Trash2 } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: favorites, isLoading } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center mt-20">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
          <p className="text-muted-foreground mb-6">سجل دخولك لعرض الأرقام المفضلة</p>
          <Button onClick={() => navigate('/auth')}>
            تسجيل الدخول
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) return <Loading />;

  const favoritesList = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">المفضلة</h1>
          </div>
          <p className="text-muted-foreground">
            {favoritesList.length} {favoritesList.length === 1 ? 'رقم' : 'أرقام'} في المفضلة
          </p>
        </div>

        {favoritesList.length === 0 ? (
          <Card className="p-12 text-center glass-card">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">لا توجد أرقام مفضلة</h2>
            <p className="text-muted-foreground mb-6">
              لم تضف أي أرقام للمفضلة بعد. تصفح الأرقام وأضف ما يعجبك!
            </p>
            <Button onClick={() => navigate('/numbers')} className="bg-gradient-primary">
              تصفح الأرقام
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoritesList.map((item: any) => {
              const phoneNumber = item.phone_number || item;
              return (
                <Card key={item.id || phoneNumber.id} className="group transition-all duration-300 hover:shadow-lg overflow-hidden">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1.5">
                        {phoneNumber.provider && (
                          <>
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              phoneNumber.provider === 'Vodafone' || phoneNumber.provider === 'فودافون' ? 'bg-red-500' :
                              phoneNumber.provider === 'Orange' || phoneNumber.provider === 'اورنج' ? 'bg-orange-500' :
                              phoneNumber.provider === 'Etisalat' || phoneNumber.provider === 'اتصالات' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`} />
                            <span className="text-xs font-medium text-muted-foreground">{phoneNumber.provider}</span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite.mutate(phoneNumber.id);
                        }}
                        disabled={removeFavorite.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Number */}
                    <div 
                      className="text-center py-4 mb-4 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => navigate(`/numbers/${phoneNumber.id}`)}
                    >
                      <div className="text-2xl font-bold text-foreground font-mono tracking-wider dir-ltr">
                        {phoneNumber.number}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">{phoneNumber.views || 0}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-primary">
                          {Number(phoneNumber.price).toLocaleString('ar-EG')}
                          <span className="text-sm font-normal text-muted-foreground mr-1">ج.م</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-5 pb-5 flex gap-2">
                    {!phoneNumber.is_sold ? (
                      <>
                        <Button
                          className="flex-1 h-9 bg-gradient-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              id: phoneNumber.id,
                              number: phoneNumber.number,
                              price: Number(phoneNumber.price),
                              provider: phoneNumber.provider,
                            });
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 ml-2" />
                          أضف للسلة
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => navigate(`/numbers/${phoneNumber.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" className="w-full h-9" disabled>
                        مباع
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
