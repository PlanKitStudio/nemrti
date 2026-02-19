import { Link } from "react-router-dom";
import { Phone, Shield, Zap, ThumbsUp, Star, TrendingUp, Users, Award, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedNumbers from "@/components/FeaturedNumbers";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCategories } from "@/hooks/useCategories";

const Index = () => {
  const { data: categories = [] } = useCategories();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <HeroSection />
      
      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                تصفح حسب 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> نوع الشبكة</span>
              </h2>
              <p className="text-muted-foreground">اختر الشبكة المفضلة لديك</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Link key={category.id} to={`/numbers?category=${category.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.phone_numbers_count || 0} رقم
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturedNumbers />
      
      {/* Ad Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdBanner 
            size="leaderboard" 
            position="home-mid"
            content={{
              title: "احصل على رقمك المميز الآن بخصم 20%",
              description: "عرض لفترة محدودة على جميع الأرقام",
              link: "/numbers"
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              لماذا 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> نمرتي</span>؟
            </h2>
            <p className="text-xl text-muted-foreground">نوفر لك أفضل تجربة لشراء الأرقام المميزة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">ضمان 100%</h3>
                <p className="text-muted-foreground">
                  جميع الأرقام مضمونة وصحيحة 100% مع إمكانية الاسترجاع
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">تفعيل فوري</h3>
                <p className="text-muted-foreground">
                  احصل على رقمك فور الدفع مع تفعيل مباشر خلال دقائق
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">أسعار تنافسية</h3>
                <p className="text-muted-foreground">
                  نوفر أفضل الأسعار في السوق مع عروض حصرية
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">دعم 24/7</h3>
                <p className="text-muted-foreground">
                  فريق دعم متواجد دائماً لمساعدتك في أي وقت
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              آراء 
              <span className="bg-gradient-primary bg-clip-text text-transparent">عملائنا</span>
            </h2>
            <p className="text-xl text-muted-foreground">ثقة آلاف العملاء في خدماتنا</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-elegant">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 ml-4">
                    <AvatarFallback className="bg-gradient-primary text-white">أح</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground">أحمد محمد</h4>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "خدمة ممتازة وأرقام رائعة! حصلت على رقم مميز بسعر معقول والتفعيل كان سريع جداً."
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 ml-4">
                    <AvatarFallback className="bg-gradient-primary text-white">سع</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground">سعيد علي</h4>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "منصة موثوقة بنسبة 100%. اشتريت عدة أرقام لشركتي والكل راضي عن الخدمة."
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 ml-4">
                    <AvatarFallback className="bg-gradient-primary text-white">مي</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground">مريم حسن</h4>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "أفضل موقع لشراء أرقام مميزة! الأسعار منافسة والتعامل احترافي جداً."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              جاهز للحصول على رقمك المميز؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              انضم لآلاف العملاء الراضين واختر رقمك المثالي الآن
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/numbers">
                  <CheckCircle className="ml-2 h-5 w-5" />
                  ابدأ الآن
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/contact">
                  تواصل معنا
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
