import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  TrendingUp, 
  MousePointer, 
  Eye, 
  DollarSign, 
  Users, 
  Target,
  Smartphone,
  Monitor,
  Download,
  Loader2,
  AlertCircle,
  ShoppingCart,
  ShieldAlert
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { format } from "date-fns";
import { useAdAnalytics } from "@/hooks/useAds";

const AdvertisingAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedPage, setSelectedPage] = useState("all");

  // Real API data
  const { data: analytics, isLoading, isError } = useAdAnalytics({
    period: selectedPeriod,
    page: selectedPage !== "all" ? selectedPage : undefined,
  });

  const overall = analytics?.overall;
  const dailyStats = analytics?.daily || [];
  const pageStats = analytics?.pages || [];
  const deviceStats = analytics?.devices || [];
  const topAds = analytics?.topAds || [];

  const exportData = () => {
    const data = {
      overview: overall,
      pages: pageStats,
      daily: dailyStats,
      devices: deviceStats,
      topAds: topAds,
      exportDate: new Date().toISOString(),
      period: selectedPeriod,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advertising-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg">جاري تحميل البيانات التحليلية...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <span className="text-lg">حدث خطأ في تحميل البيانات</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إحصائيات الإعلانات</h1>
          <p className="text-muted-foreground">تحليل شامل لأداء الإعلانات وسلوك الزوار</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            تصدير البيانات
          </Button>
          
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر الموقع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المواقع</SelectItem>
              <SelectItem value="header">رأس الصفحة</SelectItem>
              <SelectItem value="sidebar">الشريط الجانبي</SelectItem>
              <SelectItem value="footer">أسفل الصفحة</SelectItem>
              <SelectItem value="inline">داخل المحتوى</SelectItem>
              <SelectItem value="home-mid">وسط الصفحة الرئيسية</SelectItem>
              <SelectItem value="numbers-header">رأس صفحة الأرقام</SelectItem>
              <SelectItem value="numbers-inline">داخل صفحة الأرقام</SelectItem>
              <SelectItem value="numbers-footer">أسفل صفحة الأرقام</SelectItem>
              <SelectItem value="blog-header">رأس المدونة</SelectItem>
              <SelectItem value="blog-inline">داخل المدونة</SelectItem>
              <SelectItem value="blog-footer">أسفل المدونة</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 3 أشهر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المشاهدات"
          value={(overall?.totalImpressions || 0).toLocaleString()}
          icon={Eye}
          change={overall?.changes?.impressions}
        />
        <StatCard
          title="إجمالي النقرات"
          value={(overall?.totalClicks || 0).toLocaleString()}
          icon={MousePointer}
          change={overall?.changes?.clicks}
        />
        <StatCard
          title="إجمالي التحويلات"
          value={(overall?.totalConversions || 0).toLocaleString()}
          icon={ShoppingCart}
          change={overall?.changes?.conversions}
        />
        <StatCard
          title="معدل النقر (CTR)"
          value={`${overall?.averageCTR || 0}%`}
          icon={Target}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="معدل التحويل"
          value={`${overall?.conversionRate || 0}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="إجمالي الميزانيات"
          value={`${(overall?.totalRevenue || 0).toLocaleString()} ج.م`}
          icon={DollarSign}
        />
        <StatCard
          title="الزوار المميزون"
          value={(overall?.uniqueVisitors || 0).toLocaleString()}
          icon={Users}
          change={overall?.changes?.visitors}
        />
        <StatCard
          title="أحداث مشبوهة محظورة"
          value={(overall?.fraud?.suspiciousEvents || 0).toLocaleString()}
          icon={ShieldAlert}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              الأداء اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyStats.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                لا توجد بيانات يومية في هذه الفترة
              </div>
            ) : (
              <ChartContainer config={{
                impressions: { label: "المشاهدات", color: "hsl(var(--primary))" },
                clicks: { label: "النقرات", color: "hsl(var(--secondary))" },
                conversions: { label: "التحويلات", color: "#10b981" },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => {
                      try { return format(new Date(value), 'dd/MM'); } catch { return value; }
                    }} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" name="المشاهدات" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--secondary))" name="النقرات" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" name="التحويلات" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              توزيع الأجهزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deviceStats.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                لا توجد بيانات أجهزة في هذه الفترة
              </div>
            ) : (
              <>
                <ChartContainer config={{
                  mobile: { label: "الهاتف المحمول", color: "#3b82f6" },
                  desktop: { label: "الكمبيوتر", color: "#10b981" },
                  tablet: { label: "الجهاز اللوحي", color: "#f59e0b" },
                }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {deviceStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                
                <div className="mt-4 space-y-2">
                  {deviceStats.map((device: any) => (
                    <div key={device.device} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                        <span>{device.deviceArabic}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{(device.impressions || 0).toLocaleString()} مشاهدة</div>
                        <div className="text-muted-foreground">{(device.clicks || 0).toLocaleString()} نقرة</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Position Performance */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            أداء المواقع الإعلانية
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pageStats.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">لا توجد بيانات مواقع في هذه الفترة</div>
          ) : (
            <>
              <ChartContainer config={{
                impressions: { label: "المشاهدات", color: "hsl(var(--primary))" },
                clicks: { label: "النقرات", color: "#10b981" },
              }} className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="positionName" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="impressions" fill="hsl(var(--primary))" name="المشاهدات" />
                    <Bar dataKey="clicks" fill="#10b981" name="النقرات" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3 font-medium">الموقع</th>
                      <th className="text-right p-3 font-medium">المشاهدات</th>
                      <th className="text-right p-3 font-medium">النقرات</th>
                      <th className="text-right p-3 font-medium">التحويلات</th>
                      <th className="text-right p-3 font-medium">معدل النقر</th>
                      <th className="text-right p-3 font-medium">معدل التحويل</th>
                      <th className="text-right p-3 font-medium">الزوار المميزون</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageStats.map((page: any) => (
                      <tr key={page.position} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="font-medium">{page.positionName}</div>
                          <div className="text-sm text-muted-foreground">{page.position}</div>
                        </td>
                        <td className="p-3">{(page.impressions || 0).toLocaleString()}</td>
                        <td className="p-3">{(page.clicks || 0).toLocaleString()}</td>
                        <td className="p-3">{(page.conversions || 0).toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant={page.ctr >= 3.0 ? "default" : "secondary"}>
                            {page.ctr?.toFixed(1) || '0.0'}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={page.conversionRate >= 2.0 ? "default" : "secondary"}>
                            {page.conversionRate?.toFixed(1) || '0.0'}%
                          </Badge>
                        </td>
                        <td className="p-3">{(page.uniqueVisitors || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top Ads */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            أفضل الإعلانات أداءً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topAds.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">لا توجد إعلانات في هذه الفترة</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium">#</th>
                    <th className="text-right p-3 font-medium">العنوان</th>
                    <th className="text-right p-3 font-medium">الموقع</th>
                    <th className="text-right p-3 font-medium">المشاهدات</th>
                    <th className="text-right p-3 font-medium">النقرات</th>
                    <th className="text-right p-3 font-medium">التحويلات</th>
                    <th className="text-right p-3 font-medium">معدل النقر</th>
                    <th className="text-right p-3 font-medium">معدل التحويل</th>
                    <th className="text-right p-3 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {topAds.map((ad: any, index: number) => (
                    <tr key={ad.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-bold text-primary">{index + 1}</td>
                      <td className="p-3 font-medium">{ad.title}</td>
                      <td className="p-3">
                        <Badge variant="outline">{ad.position}</Badge>
                      </td>
                      <td className="p-3">{(ad.impressions || 0).toLocaleString()}</td>
                      <td className="p-3">{(ad.clicks || 0).toLocaleString()}</td>
                      <td className="p-3">{(ad.conversions || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          ad.ctr > 3 ? 'text-green-600' : 
                          ad.ctr > 1 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {ad.ctr?.toFixed(2) || '0.00'}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          ad.conversionRate > 2 ? 'text-green-600' : 
                          ad.conversionRate > 0.5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {ad.conversionRate?.toFixed(2) || '0.00'}%
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant={ad.is_active ? "default" : "secondary"}>
                          {ad.is_active ? "نشط" : "متوقف"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fraud Protection Stats */}
      {(overall?.fraud?.suspiciousEvents > 0 || overall?.fraud?.blockedClicks > 0 || overall?.fraud?.blockedImpressions > 0) && (
        <Card className="card-elegant border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              إحصائيات الحماية من الاحتيال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{(overall?.fraud?.suspiciousEvents || 0).toLocaleString()}</p>
                <p className="text-sm text-red-500 mt-1">إجمالي الأحداث المشبوهة</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{(overall?.fraud?.blockedClicks || 0).toLocaleString()}</p>
                <p className="text-sm text-orange-500 mt-1">نقرات محظورة</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{(overall?.fraud?.blockedImpressions || 0).toLocaleString()}</p>
                <p className="text-sm text-yellow-500 mt-1">مشاهدات محظورة</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">يتم تسجيل الأحداث المشبوهة ولكنها لا تُحتسب في الإحصائيات أو العدادات</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvertisingAnalytics;
