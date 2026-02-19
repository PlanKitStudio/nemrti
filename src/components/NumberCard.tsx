import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { fbqTrackAddToCart } from "@/lib/facebook-pixel";

interface NumberCardProps {
  id: string;
  number: string;
  price: number;
  provider: string | null;
  views: number;
  isAvailable: boolean;
  isFeatured?: boolean;
}

const NumberCard = ({ 
  id,
  number, 
  price, 
  provider,
  views, 
  isAvailable, 
  isFeatured = false 
}: NumberCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const network = provider || "فودافون";

  const { data: isFavorite = false } = useCheckFavorite(user ? id : '');
  const { toggle: toggleFavorite, isPending: isFavPending } = useToggleFavorite();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, number, price, provider });
    fbqTrackAddToCart(id, number, price);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'سجل دخولك لإضافة الأرقام للمفضلة',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    await toggleFavorite(id, isFavorite);
  };

  const handleViewDetails = () => {
    navigate(`/numbers/${id}`);
  };
  
  const networkColors: Record<string, string> = {
    "اورنج": "bg-orange-500",
    "Orange": "bg-orange-500",
    "فودافون": "bg-red-500",
    "Vodafone": "bg-red-500",
    "اتصالات": "bg-green-500",
    "Etisalat": "bg-green-500",
    "وي": "bg-purple-500",
    "WE": "bg-purple-500"
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 ${
        isFeatured ? 'ring-2 ring-primary/50' : ''
      } ${!isAvailable ? 'opacity-60 grayscale-[30%]' : ''}`}
      onClick={handleViewDetails}
    >
      <CardContent className="p-5">
        {/* رأس البطاقة - الشبكة والبادج */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${networkColors[network]}`}></div>
            <span className="text-xs font-medium text-muted-foreground">{network}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {isFeatured && (
              <Badge className="bg-gradient-accent text-xs px-2 py-0.5">
                مميز
              </Badge>
            )}
            <button
              onClick={handleToggleFavorite}
              disabled={isFavPending}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* الرقم - مركز الانتباه */}
        <div className="text-center py-4 mb-4 bg-secondary/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground font-mono tracking-wider dir-ltr">
            {number}
          </div>
        </div>

        {/* المعلومات - السعر والمشاهدات */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span className="text-xs">{views >= 1000 ? `${(views / 1000).toFixed(1)}ك` : views}</span>
          </div>
          
          <div className="text-left">
            <div className="text-xl font-bold text-primary">
              {price.toLocaleString('ar-EG')}
              <span className="text-sm font-normal text-muted-foreground mr-1">ج.م</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        {isAvailable ? (
          <>
            <Button 
              className="flex-1 h-9 bg-gradient-primary"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              أضف للسلة
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-9 w-9"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button 
            variant="secondary" 
            className="w-full h-9" 
            disabled
          >
            غير متاح
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NumberCard;