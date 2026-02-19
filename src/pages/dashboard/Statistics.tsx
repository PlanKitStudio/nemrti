import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  CheckCircle, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  AlertCircle,
  Clock,
  Star
} from "lucide-react";
import { formatPrice } from "@/lib/helpers";
import { useStats, useSalesChart } from "@/hooks/useStats";
import Loading from "@/components/Loading";
import { 
  ResponsiveContainer,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';

const Statistics = () => {
  const { data: stats, isLoading, isError } = useStats();
  const { data: salesData } = useSalesChart(30);
  
  if (isLoading) {
    return <Loading />;
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">خطأ في تحميل الإحصائيات</h2>
        <p className="text-muted-foreground">تأكد من اتصالك بالسيرفر وحاول مرة أخرى</p>
      </div>
    );
  }
  
  const COLORS = ['#058936', '#2FB0FF', '#F59E0B', '#EF4444'];

  // بيانات توزيع الأرقام
  const numbersDistribution = [
    { name: 'متاحة', value: stats.phone_numbers?.available || 0, color: '#058936' },
    { name: 'مباعة', value: stats.phone_numbers?.sold || 0, color: '#2FB0FF' },
    { name: 'مميزة', value: stats.phone_numbers?.featured || 0, color: '#F59E0B' },
  ];

  // بيانات حالة الطلبات
  const ordersDistribution = [
    { name: 'مكتملة', value: stats.orders?.completed || 0, color: '#058936' },
    { name: 'معلقة', value: stats.orders?.pending || 0, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الأرقام"
          value={(stats.phone_numbers?.total || 0).toLocaleString('ar-EG')}
          icon={Phone}
          change={{ value: stats.phone_numbers?.featured || 0, type: 'increase' }}
          description={`${stats.phone_numbers?.available || 0} متاح`}
        />
        <StatCard
          title="الأرقام المتاحة"
          value={(stats.phone_numbers?.available || 0).toLocaleString('ar-EG')}
          icon={CheckCircle}
          description={`${stats.phone_numbers?.sold || 0} تم بيعها`}
        />
        <StatCard
          title="إجمالي الطلبات"
          value={(stats.orders?.total || 0).toLocaleString('ar-EG')}
          icon={ShoppingCart}
          change={{ value: stats.orders?.completed || 0, type: 'increase' }}
          description={`${stats.orders?.pending || 0} طلب معلق`}
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={formatPrice(stats.orders?.total_revenue || 0)}
          icon={DollarSign}
          description={`هذا الشهر: ${formatPrice(stats.orders?.this_month_revenue || 0)}`}
        />
      </div>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="المستخدمين"
          value={(stats.users?.total || 0).toLocaleString('ar-EG')}
          icon={Users}
          change={{ value: stats.users?.new_this_month || 0, type: 'increase' }}
          description="مستخدم جديد هذا الشهر"
        />
        <StatCard
          title="المقالات"
          value={(stats.blog_posts?.total || 0).toLocaleString('ar-EG')}
          icon={FileText}
          description={`${stats.blog_posts?.published || 0} مقال منشور`}
        />
        <StatCard
          title="رسائل التواصل"
          value={(stats.contacts?.total || 0).toLocaleString('ar-EG')}
          icon={MessageSquare}
          change={{ value: stats.contacts?.new || 0, type: 'increase' }}
          description="رسالة جديدة"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* المبيعات اليومية */}
        <Card className="card-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                المبيعات اليومية
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                آخر 30 يوم
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {salesData && salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorStatsSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#058936" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#058936" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [formatPrice(value), 'المبيعات']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#058936" 
                    fillOpacity={1}
                    fill="url(#colorStatsSales)"
                    strokeWidth={3}
                    name="المبيعات"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <TrendingUp className="w-12 h-12 mb-4 opacity-30" />
                <p>لا توجد بيانات مبيعات حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* توزيع الأرقام */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              توزيع الأرقام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={numbersDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {numbersDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ملخص الطلبات */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              ملخص الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-green-600">{stats.orders?.completed || 0}</p>
                  <p className="text-sm text-muted-foreground">طلبات مكتملة</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-yellow-600">{stats.orders?.pending || 0}</p>
                  <p className="text-sm text-muted-foreground">طلبات معلقة</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">إجمالي الإيرادات</span>
                  <span className="font-bold text-primary">{formatPrice(stats.orders?.total_revenue || 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">إيرادات هذا الشهر</span>
                  <span className="font-bold text-primary">{formatPrice(stats.orders?.this_month_revenue || 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">متوسط قيمة الطلب</span>
                  <span className="font-bold text-primary">
                    {stats.orders?.total && stats.orders.total > 0 
                      ? formatPrice(Math.round((stats.orders.total_revenue || 0) / stats.orders.total))
                      : formatPrice(0)
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* توزيع حالات الطلبات */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {ordersDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ملخص شامل */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            ملخص شامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 rounded-xl bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{stats.phone_numbers?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">إجمالي الأرقام</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{stats.phone_numbers?.available || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">أرقام متاحة</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-orange-500/10">
              <p className="text-2xl font-bold text-orange-600">{stats.orders?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">إجمالي الطلبات</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-violet-500/10">
              <p className="text-2xl font-bold text-violet-600">{stats.users?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">المستخدمين</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-cyan-500/10">
              <p className="text-2xl font-bold text-cyan-600">{stats.blog_posts?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">المقالات</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/10">
              <p className="text-2xl font-bold text-amber-600">{stats.contacts?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">الرسائل</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;