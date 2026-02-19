import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentSettingsAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Phone, Wallet, Landmark, Save, Loader2, RefreshCw,
} from 'lucide-react';

const SECTIONS = [
  {
    title: 'فودافون كاش',
    icon: Phone,
    color: 'text-red-600',
    fields: [
      { key: 'vodafone_cash_number', label: 'رقم فودافون كاش', placeholder: '01xxxxxxxxx', mono: true },
      { key: 'vodafone_cash_name', label: 'اسم صاحب المحفظة', placeholder: 'الاسم بالكامل' },
    ],
  },
  {
    title: 'إنستاباي',
    icon: Wallet,
    color: 'text-blue-600',
    fields: [
      { key: 'instapay_number', label: 'رقم إنستاباي', placeholder: '01xxxxxxxxx', mono: true },
      { key: 'instapay_name', label: 'اسم صاحب الحساب', placeholder: 'الاسم بالكامل' },
    ],
  },
  {
    title: 'التحويل البنكي',
    icon: Landmark,
    color: 'text-indigo-600',
    fields: [
      { key: 'bank_name', label: 'اسم البنك', placeholder: 'مثال: البنك الأهلي المصري' },
      { key: 'bank_account_number', label: 'رقم الحساب', placeholder: 'رقم الحساب البنكي', mono: true },
      { key: 'bank_account_name', label: 'اسم صاحب الحساب', placeholder: 'الاسم بالكامل' },
      { key: 'bank_iban', label: 'IBAN (اختياري)', placeholder: 'EGxxxxxxxxx', mono: true },
    ],
  },
];

const PaymentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: paymentSettingsAPI.get,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => paymentSettingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      toast({ title: 'تم الحفظ', description: 'تم تحديث إعدادات الدفع بنجاح' });
    },
    onError: () => {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء حفظ الإعدادات', variant: 'destructive' });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">إعدادات الدفع</h2>
          <p className="text-sm text-muted-foreground mt-1">
            إعداد بيانات التحويل التي تظهر للعملاء أثناء الدفع
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-gradient-primary"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 ml-2" />
          )}
          حفظ التغييرات
        </Button>
      </div>

      <div className="grid gap-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${section.color}`} />
                {section.title}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      value={formData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`mt-1 ${field.mono ? 'font-mono' : ''}`}
                      dir={field.mono ? 'ltr' : undefined}
                    />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentSettings;
