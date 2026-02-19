import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  CheckCircle, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Users,
  Package,
  Clock,
  Star,
  AlertCircle,
  ArrowUpLeft,
  ArrowDownLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/helpers";
import { useStats, useSalesChart } from "@/hooks/useStats";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

/* ─── Mini stat card (cleaner than EnhancedStatCard) ─── */
interface MiniStatProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  trend?: { value: number; up: boolean };
}

const MiniStat = ({ title, value, icon: Icon, subtitle, trend }: MiniStatProps) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.up ? "text-green-500" : "text-red-500"}`}>
          {trend.up ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
          {trend.value}%
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  const { data: stats, isLoading, isError } = useStats();
  const { data: salesData } = useSalesChart(30);

  if (isLoading) return <Loading />;

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">خطأ في تحميل البيانات</h2>
        <p className="text-muted-foreground text-sm">تأكد من اتصالك بالسيرفر وحاول مرة أخرى</p>
      </div>
    );
  }

  const completionRate = stats.orders?.total
    ? Math.round((stats.orders.completed / stats.orders.total) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">مرحباً بك 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">إليك ملخص أداء المنصة</p>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat
          title="إجمالي الأرقام"
          value={stats.phone_numbers?.total?.toLocaleString("ar-EG") || "0"}
          icon={Phone}
          subtitle={`${stats.phone_numbers?.featured || 0} مميز`}
        />
        <MiniStat
          title="متاحة للبيع"
          value={stats.phone_numbers?.available?.toLocaleString("ar-EG") || "0"}
          icon={CheckCircle}
          subtitle={`${stats.phone_numbers?.sold || 0} تم بيعها`}
        />
        <MiniStat
          title="الطلبات"
          value={stats.orders?.total?.toLocaleString("ar-EG") || "0"}
          icon={ShoppingCart}
          subtitle={`${stats.orders?.pending || 0} معلق`}
          trend={completionRate > 0 ? { value: completionRate, up: true } : undefined}
        />
        <MiniStat
          title="الإيرادات"
          value={formatPrice(stats.orders?.total_revenue || 0)}
          icon={DollarSign}
          subtitle={`هذا الشهر: ${formatPrice(stats.orders?.this_month_revenue || 0)}`}
        />
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat
          title="المستخدمين"
          value={stats.users?.total?.toLocaleString("ar-EG") || "0"}
          icon={Users}
          subtitle={`${stats.users?.new_this_month || 0} جديد هذا الشهر`}
        />
        <MiniStat
          title="المقالات"
          value={stats.blog_posts?.total?.toLocaleString("ar-EG") || "0"}
          icon={TrendingUp}
          subtitle={`${stats.blog_posts?.published || 0} منشور`}
        />
        <MiniStat
          title="رسائل التواصل"
          value={stats.contacts?.total?.toLocaleString("ar-EG") || "0"}
          icon={Package}
          subtitle={`${stats.contacts?.new || 0} جديدة`}
        />
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart — takes 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">المبيعات اليومية</CardTitle>
              <Badge variant="secondary" className="text-xs">آخر 30 يوم</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {salesData && salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152,95%,29%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(152,95%,29%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 13,
                    }}
                    formatter={(value: any) => [formatPrice(value), "المبيعات"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(152,95%,29%)"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">لا توجد بيانات مبيعات</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order & Number summaries — 1/3 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                ملخص الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "معلقة", value: stats.orders?.pending || 0, color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
                { label: "مكتملة", value: stats.orders?.completed || 0, color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
              ].map((r) => (
                <div key={r.label} className={`flex items-center justify-between p-2.5 rounded-lg ${r.bg}`}>
                  <div className="flex items-center gap-2">
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                    <span className="text-sm">{r.label}</span>
                  </div>
                  <span className="font-semibold text-sm">{r.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm">الإيرادات</span>
                </div>
                <span className="font-semibold text-sm text-primary">{formatPrice(stats.orders?.total_revenue || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                ملخص الأرقام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "إجمالي", value: stats.phone_numbers?.total || 0, color: "text-primary", bg: "bg-primary/10", icon: Phone },
                { label: "متاحة", value: stats.phone_numbers?.available || 0, color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
                { label: "مميزة", value: stats.phone_numbers?.featured || 0, color: "text-amber-500", bg: "bg-amber-500/10", icon: Star },
              ].map((r) => (
                <div key={r.label} className={`flex items-center justify-between p-2.5 rounded-lg ${r.bg}`}>
                  <div className="flex items-center gap-2">
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                    <span className="text-sm">{r.label}</span>
                  </div>
                  <span className="font-semibold text-sm">{r.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2">
            <Link to="/dashboard/numbers">
              <Button variant="outline" size="sm" className="w-full text-xs">إضافة رقم</Button>
            </Link>
            <Link to="/dashboard/orders">
              <Button variant="outline" size="sm" className="w-full text-xs">الطلبات</Button>
            </Link>
            <Link to="/dashboard/users">
              <Button variant="outline" size="sm" className="w-full text-xs">المستخدمين</Button>
            </Link>
            <Link to="/dashboard/statistics">
              <Button variant="outline" size="sm" className="w-full text-xs">التحليلات</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;