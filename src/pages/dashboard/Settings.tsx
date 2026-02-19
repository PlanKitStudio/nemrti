import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, Palette, Globe, Shield, Bell, Database, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: "نمرتي - أرقام الموبايل المميزة",
    siteDescription: "منصة لبيع وشراء أرقام الموبايل المميزة في مصر",
    contactEmail: "info@numrti.com",
    contactPhone: "+201001234567",
    currency: "EGP",
    language: "ar",
    theme: "light",
    enableNotifications: true,
    enableEmailMarketing: false,
    maintenanceMode: false,
    registrationEnabled: true,
    commissionRate: 5,
    minNumberPrice: 100,
    maxNumberPrice: 100000,
    autoApproveAds: false,
    requirePhoneVerification: true,
    enableSocialLogin: true,
    // PayMob Settings
    paymobApiKey: '',
    paymobIntegrationId: '',
    paymobIframeId: '',
    paymobHmacSecret: '',
    paymobEnabled: false,
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ جميع الإعدادات بنجاح",
    });
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إعدادات النظام</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="business">الأعمال</TabsTrigger>
          <TabsTrigger value="paymob">PayMob</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">اسم الموقع</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange("siteName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">وصف الموقع</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">رقم الهاتف</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">اللغة</Label>
                    <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">الإنجليزية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>وضع الصيانة</Label>
                    <p className="text-sm text-muted-foreground">تعطيل الموقع مؤقتاً للصيانة</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل التسجيل</Label>
                    <p className="text-sm text-muted-foreground">السماح للمستخدمين الجدد بالتسجيل</p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => handleInputChange("registrationEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إعدادات المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">النمط</Label>
                <Select value={settings.theme} onValueChange={(value) => handleInputChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>تحميل شعار الموقع</Label>
                <div className="mt-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 ml-2" />
                    تحميل الشعار
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                إعدادات الأعمال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="commissionRate">نسبة العمولة (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleInputChange("commissionRate", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minPrice">أقل سعر للرقم (ج.م)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={settings.minNumberPrice}
                    onChange={(e) => handleInputChange("minNumberPrice", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">أعلى سعر للرقم (ج.م)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={settings.maxNumberPrice}
                    onChange={(e) => handleInputChange("maxNumberPrice", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>الموافقة التلقائية على الإعلانات</Label>
                  <p className="text-sm text-muted-foreground">الموافقة على الإعلانات الجديدة تلقائياً</p>
                </div>
                <Switch
                  checked={settings.autoApproveAds}
                  onCheckedChange={(checked) => handleInputChange("autoApproveAds", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paymob">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                إعدادات PayMob
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>تفعيل الدفع عبر PayMob</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح للعملاء بالدفع عبر بطاقات الائتمان والمحافظ الإلكترونية
                  </p>
                </div>
                <Switch
                  checked={settings.paymobEnabled}
                  onCheckedChange={(checked) => handleInputChange("paymobEnabled", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymobApiKey">API Key</Label>
                  <Input
                    id="paymobApiKey"
                    type="password"
                    value={settings.paymobApiKey}
                    onChange={(e) => handleInputChange("paymobApiKey", e.target.value)}
                    placeholder="أدخل مفتاح API الخاص بـ PayMob"
                    dir="ltr"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    يمكنك الحصول عليه من لوحة تحكم PayMob &rarr; Settings &rarr; API Keys
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymobIntegrationId">Integration ID</Label>
                    <Input
                      id="paymobIntegrationId"
                      value={settings.paymobIntegrationId}
                      onChange={(e) => handleInputChange("paymobIntegrationId", e.target.value)}
                      placeholder="مثال: 123456"
                      dir="ltr"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      معرف التكامل من PayMob Dashboard
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="paymobIframeId">iFrame ID</Label>
                    <Input
                      id="paymobIframeId"
                      value={settings.paymobIframeId}
                      onChange={(e) => handleInputChange("paymobIframeId", e.target.value)}
                      placeholder="مثال: 789012"
                      dir="ltr"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      معرف الإطار من PayMob Dashboard
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymobHmacSecret">HMAC Secret</Label>
                  <Input
                    id="paymobHmacSecret"
                    type="password"
                    value={settings.paymobHmacSecret}
                    onChange={(e) => handleInputChange("paymobHmacSecret", e.target.value)}
                    placeholder="أدخل HMAC Secret للتحقق من الإشعارات"
                    dir="ltr"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    للتحقق من صحة إشعارات الدفع من PayMob
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">ملاحظات مهمة:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>تأكد من إنشاء حساب على <a href="https://paymob.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paymob.com</a> أولاً</li>
                  <li>استخدم بيانات الـ Sandbox للاختبار قبل التفعيل الفعلي</li>
                  <li>يجب ضبط الـ Callback URL في إعدادات PayMob لاستقبال الإشعارات</li>
                  <li>تأكد من تفعيل Integration الخاص بالبطاقات الائتمانية</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل التحقق من رقم الهاتف</Label>
                  <p className="text-sm text-muted-foreground">طلب التحقق من رقم الهاتف عند التسجيل</p>
                </div>
                <Switch
                  checked={settings.requirePhoneVerification}
                  onCheckedChange={(checked) => handleInputChange("requirePhoneVerification", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>تسجيل الدخول عبر وسائل التواصل</Label>
                  <p className="text-sm text-muted-foreground">السماح بتسجيل الدخول عبر Google و Facebook</p>
                </div>
                <Switch
                  checked={settings.enableSocialLogin}
                  onCheckedChange={(checked) => handleInputChange("enableSocialLogin", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">إرسال إشعارات للمستخدمين</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>التسويق الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">إرسال رسائل تسويقية للمستخدمين</p>
                </div>
                <Switch
                  checked={settings.enableEmailMarketing}
                  onCheckedChange={(checked) => handleInputChange("enableEmailMarketing", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>حالة النظام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              النظام يعمل بشكل طبيعي
            </Badge>
            <Badge variant="outline">
              آخر تحديث: {new Date().toLocaleDateString('ar')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}