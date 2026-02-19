import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  number: string;
  price: number;
  provider?: string;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    const saved = localStorage.getItem('cart_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cart_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cart_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (item: CartItem) => {
    if (items.find(i => i.id === item.id)) {
      toast({
        title: 'الرقم موجود في السلة',
        variant: 'destructive',
      });
      return;
    }
    setItems([...items, item]);
    toast({
      title: 'تمت الإضافة للسلة',
      description: `تم إضافة ${item.number}`,
    });
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({
      title: 'تم الحذف من السلة',
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
    toast({
      title: 'تم تطبيق الكوبون',
      description: `كود الخصم: ${coupon.code}`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: 'تم إزالة الكوبون',
    });
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((totalPrice * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, totalPrice)
    : 0;

  const finalPrice = Math.max(0, totalPrice - discountAmount);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, clearCart, 
      totalPrice, discountAmount, finalPrice, itemCount,
      appliedCoupon, applyCoupon, removeCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
