import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2,
  Users,
  Clock,
  Calendar,
  Target,
  Award
} from "lucide-react";
import StatCard from "./StatCard";

interface BlogAnalyticsProps {
  posts: any[];
}

const BlogAnalytics = ({ posts }: BlogAnalyticsProps) => {
  // Calculate statistics
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  const totalShares = posts.reduce((sum, p) => sum + (p.shares || 0), 0);

  // Performance data for last 7 days
  const performanceData = [
    { date: '2024-01-01', views: 1200, likes: 85, comments: 23, shares: 12 },
    { date: '2024-01-02', views: 980, likes: 67, comments: 18, shares: 8 },
    { date: '2024-01-03', views: 1450, likes: 102, comments: 31, shares: 15 },
    { date: '2024-01-04', views: 1100, likes: 78, comments: 20, shares: 10 },
    { date: '2024-01-05', views: 1680, likes: 124, comments: 38, shares: 22 },
    { date: '2024-01-06', views: 1350, likes: 89, comments: 27, shares: 14 },
    { date: '2024-01-07', views: 1520, likes: 95, comments: 29, shares: 18 }
  ];

  // Category performance
  const categoryData = [
    { category: 'نصائح', posts: 8, views: 4200, engagement: 12.5 },
    { category: 'أخبار', posts: 5, views: 2800, engagement: 8.3 },
    { category: 'تقنية', posts: 6, views: 3500, engagement: 15.2 },
    { category: 'تحليلات', posts: 4, views: 2100, engagement: 9.8 }
  ];

  // Top performing posts
  const topPosts = posts
    .filter(p => p.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Engagement metrics
  const avgViewsPerPost = totalViews / publishedPosts || 0;
  const engagementRate = ((totalLikes + totalComments + totalShares) / totalViews * 100) || 0;
  const likesToViewsRatio = (totalLikes / totalViews * 100) || 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard
          title="إجمالي المقالات"
          value={totalPosts}
          icon={MessageSquare}
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="المقالات المنشورة"
          value={publishedPosts}
          icon={Eye}
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="إجمالي المشاهدات"
          value={totalViews.toLocaleString()}
          icon={TrendingUp}
          change={{ value: 25, type: 'increase' }}
        />
        <StatCard
          title="إجمالي الإعجابات"
          value={totalLikes.toLocaleString()}
          icon={Heart}
          change={{ value: 15, type: 'increase' }}
        />
        <StatCard
          title="إجمالي التعليقات"
          value={totalComments.toLocaleString()}
          icon={MessageSquare}
          change={{ value: 18, type: 'increase' }}
        />
        <StatCard
          title="إجمالي المشاركات"
          value={totalShares.toLocaleString()}
          icon={Share2}
          change={{ value: 22, type: 'increase' }}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Trend */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              الأداء اليومي (آخر 7 أيام)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              views: { label: "المشاهدات", color: "hsl(var(--primary))" },
              likes: { label: "الإعجابات", color: "hsl(var(--secondary))" },
              comments: { label: "التعليقات", color: "hsl(var(--accent))" }
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" name="المشاهدات" strokeWidth={2} />
                  <Line type="monotone" dataKey="likes" stroke="hsl(var(--secondary))" name="الإعجابات" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="hsl(var(--accent))" name="التعليقات" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              أداء الفئات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              views: { label: "المشاهدات", color: "hsl(var(--primary))" },
              engagement: { label: "معدل التفاعل", color: "hsl(var(--secondary))" }
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="المشاهدات" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-4 space-y-3">
              {categoryData.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm font-medium">{category.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.posts} مقال
                    </Badge>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{category.engagement.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">معدل التفاعل</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">متوسط المشاهدات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">
              {avgViewsPerPost.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-muted-foreground">مشاهدة لكل مقال</p>
            <Progress value={Math.min((avgViewsPerPost / 2000) * 100, 100)} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">معدل التفاعل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {engagementRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">من إجمالي المشاهدات</p>
            <Progress value={Math.min(engagementRate * 10, 100)} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">نسبة الإعجاب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500 mb-2">
              {likesToViewsRatio.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">من المشاهدات</p>
            <Progress value={Math.min(likesToViewsRatio * 20, 100)} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            أفضل المقالات أداءً
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{post.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <Badge className={post.status === 'published' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {post.status === 'published' ? 'منشور' : 'مسودة'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Time Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              تحليل وقت القراءة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">أقل من دقيقة</span>
                <div className="flex items-center gap-2">
                  <Progress value={15} className="w-20" />
                  <span className="text-xs text-muted-foreground">15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">1-3 دقائق</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-20" />
                  <span className="text-xs text-muted-foreground">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">3-5 دقائق</span>
                <div className="flex items-center gap-2">
                  <Progress value={30} className="w-20" />
                  <span className="text-xs text-muted-foreground">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">أكثر من 5 دقائق</span>
                <div className="flex items-center gap-2">
                  <Progress value={10} className="w-20" />
                  <span className="text-xs text-muted-foreground">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              أفضل أوقات النشر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium mb-2">أفضل الأيام:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">الأحد (18%)</Badge>
                  <Badge variant="outline">الثلاثاء (16%)</Badge>
                  <Badge variant="outline">الخميس (15%)</Badge>
                  <Badge variant="outline">الاثنين (14%)</Badge>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-2">أفضل الأوقات:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">9:00 - 11:00</Badge>
                  <Badge variant="outline">14:00 - 16:00</Badge>
                  <Badge variant="outline">20:00 - 22:00</Badge>
                  <Badge variant="outline">7:00 - 9:00</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogAnalytics;