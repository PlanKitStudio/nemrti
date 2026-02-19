import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AdBanner from "@/components/AdBanner";
import Loading from "@/components/Loading";
import { Search, Clock, User, ArrowRight, Eye } from "lucide-react";
import { useBlogPosts, useBlogCategories } from "@/hooks/useBlogPosts";
import { getStorageUrl } from "@/lib/api";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: postsData, isLoading, error } = useBlogPosts({ 
    search: searchTerm || undefined,
    category_id: selectedCategory !== "all" ? selectedCategory : undefined 
  });
  const { data: categoriesData } = useBlogCategories();

  if (isLoading) return <Loading />;

  // Extract posts array from paginated data
  const posts = Array.isArray(postsData) ? postsData : postsData?.data || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const categoryOptions = [
    { value: "all", label: "جميع المقالات" },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Hero Section - احترافي ونظيف */}
      <section className="pt-24 pb-8 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              مدونة 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> نمرتي</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              كل ما تحتاج معرفته عن أرقام الموبايل المميزة
            </p>
          </div>

          {/* Header Banner Ad */}
          <div className="mb-6">
            <AdBanner 
              size="leaderboard" 
              position="blog-header"
              content={{
                title: "احصل على خصم 20% على جميع الأرقام المميزة",
                description: "عرض محدود لفترة قصيرة",
                link: "/numbers"
              }}
            />
          </div>
        </div>
      </section>

      {/* Filters Section - مدمج ونظيف */}
      <section className="py-6 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {/* الصف الأول: البحث والتصنيف */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في المقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-10"
                />
              </div>
              
              <div className="md:col-span-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* الصف الثاني: النتائج والفلاتر النشطة */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium text-foreground">
                {isLoading ? "جاري البحث..." : `${posts.length} مقال`}
              </div>
              
              {(searchTerm || selectedCategory !== "all") && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-secondary/80" 
                        onClick={() => setSearchTerm("")}
                      >
                        {searchTerm} ×
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="h-6 text-xs"
                    >
                      إعادة تعيين
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid - نظيف ومرتب */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <Loading />
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={getStorageUrl(post.featured_image)} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-5 flex-1 flex flex-col">
                      {post.category && (
                        <Badge variant="secondary" className="w-fit mb-3 text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{post.views_count || 0}</span>
                        </div>
                        {post.published_at && (
                          <span>{new Date(post.published_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full h-9 text-sm" 
                        asChild
                      >
                        <Link to={`/blog/${post.slug}`}>
                          اقرأ المزيد
                          <ArrowRight className="h-4 w-4 mr-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Ad Banner every 8 posts */}
                  {(index + 1) % 8 === 0 && (
                    <div className="col-span-full my-6">
                      <AdBanner 
                        size="wide" 
                        position="blog-inline"
                        content={{
                          title: "أرقام VIP حصرية",
                          description: "اكتشف مجموعتنا المميزة من الأرقام الحصرية",
                          link: "/numbers?featured=true"
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد مقالات</h3>
              <p className="text-muted-foreground mb-6">لم نجد مقالات تطابق معايير البحث</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-primary"
              >
                إعادة تعيين البحث
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdBanner 
            size="leaderboard" 
            position="blog-footer"
            content={{
              title: "ابدأ رحلتك مع رقم مميز اليوم",
              description: "اكتشف آلاف الأرقام المميزة بأفضل الأسعار",
              link: "/numbers"
            }}
          />
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Blog;