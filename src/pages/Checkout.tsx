import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI, paymentSettingsAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Phone, ChevronLeft, ChevronRight, User, MapPin, CreditCard, Banknote,
  Wallet, Upload, Image, Loader2, Ticket, Check, Copy, CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { fbqTrackPurchase } from '@/lib/facebook-pixel';

type Step = 'info' | 'payment' | 'proof';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'الدفع عند الاستلام', desc: 'ادفع نقداً عند استلام الرقم', icon: Banknote, color: 'text-green-600' },
  { value: 'vodafone_cash', label: 'فودافون كاش', desc: 'حوّل المبلغ على فودافون كاش', icon: Phone, color: 'text-red-600' },
  { value: 'instapay', label: 'إنستاباي', desc: 'حوّل المبلغ عبر إنستاباي', icon: Smartphone, color: 'text-blue-600' },
  { value: 'bank_transfer', label: 'تحويل بنكي', desc: 'حوّل المبلغ إلى حسابنا البنكي', icon: Wallet, color: 'text-indigo-600' },
];

const NEEDS_PROOF = ['vodafone_cash', 'instapay', 'bank_transfer'];

const Checkout = () => {
  const { user } = useAuth();
  const { items, totalPrice, discountAmount, finalPrice, appliedCoupon, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('info');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    customer_name: user?.name || '',
    customer_phone: user?.phone || '',
    customer_whatsapp: '',
    customer_city: '',
    customer_address: '',
  });

  // Fetch payment settings
  const { data: paymentSettings } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: paymentSettingsAPI.get,
    staleTime: 5 * 60 * 1000,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => ordersAPI.create(orderData),
    onError: (error: any) => {
      const data = error.response?.data;
      let description = data?.message || 'حدث خطأ أثناء إنشاء الطلب';
      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        if (firstError) description = String(firstError);
      }
      toast({ title: 'خطأ في إنشاء الطلب', description, variant: 'destructive' });
    },
  });

  // Upload proof mutation
  const uploadProofMutation = useMutation({
    mutationFn: ({ orderId, file }: { orderId: string; file: File }) =>
      ordersAPI.uploadPaymentProof(orderId, file),
  });

  // Redirect if not logged in or cart is empty (outside mutation lifecycle)
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    } else if (items.length === 0 && !createOrderMutation.isPending && !createOrderMutation.isSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [user, items.length, createOrderMutation.isPending, createOrderMutation.isSuccess]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview);
    };
  }, [proofPreview]);

  if (!user || (items.length === 0 && !createOrderMutation.isPending && !createOrderMutation.isSuccess)) {
    return null;
  }

  const updateField = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'حجم الصورة كبير', description: 'الحد الأقصى 5 ميجابايت', variant: 'destructive' });
      return;
    }
    setProofFile(file);
    // Revoke previous object URL to prevent memory leak
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(URL.createObjectURL(file));
  };

  const validateStep = (currentStep: Step): boolean => {
    if (currentStep === 'info') {
      if (!customerInfo.customer_name.trim()) {
        toast({ title: 'الاسم مطلوب', variant: 'destructive' });
        return false;
      }
      if (!customerInfo.customer_phone.trim()) {
        toast({ title: 'رقم الموبايل مطلوب', variant: 'destructive' });
        return false;
      }
      return true;
    }
    if (currentStep === 'payment') {
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (step === 'info' && validateStep('info')) {
      setStep('payment');
    } else if (step === 'payment') {
      if (NEEDS_PROOF.includes(paymentMethod)) {
        setStep('proof');
      } else {
        handleSubmitOrder();
      }
    } else if (step === 'proof') {
      handleSubmitOrder();
    }
  };

  const goBack = () => {
    if (step === 'proof') setStep('payment');
    else if (step === 'payment') setStep('info');
    else navigate('/cart');
  };

  const handleSubmitOrder = async () => {
    const orderData = {
      items: items.map((item) => ({
        phone_number_id: item.id,
        price: item.price,
      })),
      payment_method: paymentMethod,
      coupon_code: appliedCoupon?.code || null,
      notes,
      ...customerInfo,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: async (response) => {
        const order = response?.data || response;
        const orderId = order?.id;

        // Upload payment proof if exists
        if (proofFile && orderId) {
          try {
            await uploadProofMutation.mutateAsync({ orderId, file: proofFile });
          } catch {
            // Non-critical: order was created, proof upload failed
          }
        }

        // Track purchase
        fbqTrackPurchase(items.map((i) => i.id), finalPrice, items.length);

        // Invalidate caches so sold numbers disappear
        queryClient.invalidateQueries({ queryKey: ['phone_numbers'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });

        clearCart();

        // Navigate to thank you
        navigate('/thank-you', {
          state: {
            orderId,
            orderData: order,
            customerInfo,
            paymentMethod,
            items: [...items],
            totalPrice,
            discountAmount,
            finalPrice,
            couponCode: appliedCoupon?.code,
          },
        });
      },
    });
  };

  const steps = [
    { key: 'info', label: 'بياناتك', icon: User },
    { key: 'payment', label: 'الدفع', icon: CreditCard },
    ...(NEEDS_PROOF.includes(paymentMethod) ? [{ key: 'proof', label: 'إثبات الدفع', icon: Upload }] : []),
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/cart')} className="text-muted-foreground hover:text-primary transition-colors">
            السلة
          </button>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-primary font-semibold">إتمام الطلب</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = i === currentStepIndex;
            const isCompleted = i < currentStepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={`w-8 sm:w-12 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                )}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : isCompleted
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Customer Info */}
            {step === 'info' && (
              <Card className="p-6 glass-card animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  بيانات التواصل
                </h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم بالكامل *</Label>
                      <Input
                        id="name"
                        value={customerInfo.customer_name}
                        onChange={(e) => updateField('customer_name', e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الموبايل *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.customer_phone}
                        onChange={(e) => updateField('customer_phone', e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="mt-1 font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">رقم الواتساب (اختياري)</Label>
                    <Input
                      id="whatsapp"
                      value={customerInfo.customer_whatsapp}
                      onChange={(e) => updateField('customer_whatsapp', e.target.value)}
                      placeholder="لو مختلف عن رقم الموبايل"
                      className="mt-1 font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">المدينة (اختياري)</Label>
                      <Input
                        id="city"
                        value={customerInfo.customer_city}
                        onChange={(e) => updateField('customer_city', e.target.value)}
                        placeholder="مثال: القاهرة"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">العنوان (اختياري)</Label>
                      <Input
                        id="address"
                        value={customerInfo.customer_address}
                        onChange={(e) => updateField('customer_address', e.target.value)}
                        placeholder="العنوان بالتفصيل"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 'payment' && (
              <Card className="p-6 glass-card animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  طريقة الدفع
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={method.value} />
                        <Icon className={`h-6 w-6 ${method.color}`} />
                        <div>
                          <p className="font-semibold">{method.label}</p>
                          <p className="text-sm text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </Card>
            )}

            {/* Step 3: Payment Proof (for vodafone_cash, instapay, bank_transfer) */}
            {step === 'proof' && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Transfer Details */}
                <Card className="p-6 glass-card">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    بيانات التحويل
                  </h2>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                    <p className="text-sm font-semibold text-primary mb-3">
                      {paymentMethod === 'vodafone_cash' && 'حوّل المبلغ على رقم فودافون كاش التالي:'}
                      {paymentMethod === 'instapay' && 'حوّل المبلغ عبر إنستاباي على:'}
                      {paymentMethod === 'bank_transfer' && 'حوّل المبلغ على الحساب البنكي التالي:'}
                    </p>

                    {paymentMethod === 'vodafone_cash' && (
                      <>
                        <InfoRow
                          label="رقم فودافون كاش"
                          value={paymentSettings?.vodafone_cash_number || 'لم يتم تحديده بعد'}
                          onCopy={() => handleCopy(paymentSettings?.vodafone_cash_number || '', 'vcn')}
                          copied={copiedField === 'vcn'}
                        />
                        <InfoRow
                          label="الاسم"
                          value={paymentSettings?.vodafone_cash_name || '—'}
                        />
                      </>
                    )}

                    {paymentMethod === 'instapay' && (
                      <>
                        <InfoRow
                          label="رقم إنستاباي"
                          value={paymentSettings?.instapay_number || 'لم يتم تحديده بعد'}
                          onCopy={() => handleCopy(paymentSettings?.instapay_number || '', 'ipn')}
                          copied={copiedField === 'ipn'}
                        />
                        <InfoRow
                          label="الاسم"
                          value={paymentSettings?.instapay_name || '—'}
                        />
                      </>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <>
                        <InfoRow label="البنك" value={paymentSettings?.bank_name || '—'} />
                        <InfoRow
                          label="رقم الحساب"
                          value={paymentSettings?.bank_account_number || 'لم يتم تحديده بعد'}
                          onCopy={() => handleCopy(paymentSettings?.bank_account_number || '', 'ban')}
                          copied={copiedField === 'ban'}
                        />
                        <InfoRow label="اسم صاحب الحساب" value={paymentSettings?.bank_account_name || '—'} />
                        {paymentSettings?.bank_iban && (
                          <InfoRow
                            label="IBAN"
                            value={paymentSettings.bank_iban}
                            onCopy={() => handleCopy(paymentSettings.bank_iban, 'iban')}
                            copied={copiedField === 'iban'}
                          />
                        )}
                      </>
                    )}

                    <div className="pt-2 border-t border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">المبلغ المطلوب</span>
                        <span className="text-xl font-bold text-primary">
                          {finalPrice.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Upload Proof */}
                <Card className="p-6 glass-card">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    رفع إثبات الدفع (سكرين شوت)
                  </h2>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {proofPreview ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <img
                          src={proofPreview}
                          alt="إثبات الدفع"
                          className="w-full max-h-72 object-contain bg-muted/30"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Image className="h-4 w-4 ml-2" />
                          تغيير الصورة
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setProofFile(null);
                            setProofPreview('');
                          }}
                          className="text-destructive"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center transition-all hover:bg-primary/5"
                    >
                      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">اضغط لرفع سكرين شوت التحويل</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG — حد أقصى 5 ميجابايت</p>
                    </button>
                  )}

                  <p className="text-xs text-muted-foreground mt-3">
                    * رفع إثبات الدفع اختياري — يمكنك رفعه لاحقاً أو إرساله على واتساب
                  </p>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={goBack} className="flex-1">
                <ChevronRight className="h-4 w-4 ml-2" />
                رجوع
              </Button>
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={goNext}
                disabled={createOrderMutation.isPending || uploadProofMutation.isPending}
              >
                {createOrderMutation.isPending || uploadProofMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري إنشاء الطلب...
                  </>
                ) : step === 'payment' && !NEEDS_PROOF.includes(paymentMethod) ? (
                  'تأكيد الطلب'
                ) : step === 'proof' ? (
                  'تأكيد الطلب'
                ) : (
                  <>
                    التالي
                    <ChevronLeft className="h-4 w-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-5 glass-card sticky top-24">
              <h3 className="font-bold mb-4">ملخص الطلب</h3>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm" dir="ltr">{item.number}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.price.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
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
                      <Ticket className="h-3 w-3" />
                      خصم ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold">- {discountAmount.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{finalPrice.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function InfoRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-sm">{value}</span>
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-1 rounded hover:bg-muted transition-colors"
            title="نسخ"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Checkout;
