import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCountUp, useScrollAnimation } from "@/hooks/useAnimations";

const StatCard = ({ target, label, gradient = "bg-gradient-primary", suffix = "+" }: { target: number; label: string; gradient?: string; suffix?: string }) => {
  const { count, ref } = useCountUp(target, 2000);
  return (
    <Card ref={ref} className="bg-secondary/50 border-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className={`text-4xl font-bold ${gradient} bg-clip-text text-transparent mb-2`}>
          {count.toLocaleString('ar-EG')}{suffix}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
};

const HeroSection = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center">
          {/* العنوان الرئيسي */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
              اختار رقمك
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                وميّز نفسك
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              منصة نمرتي - أكبر مجموعة من أرقام الموبايل المميزة في مكان واحد
            </p>
          </div>

          {/* الميزات السريعة */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/50 px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">ضمان الجودة</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/50 px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors">
              <Zap className="h-5 w-5 text-accent" />
              <span className="text-sm text-foreground">تفعيل فوري</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-secondary/50 px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-sm text-foreground">أرقام حصرية</span>
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Button 
              size="lg" 
              className="bg-gradient-primary glow-primary text-lg px-8 py-6 h-auto hover:scale-105 transition-transform"
              asChild
            >
              <Link to="/numbers">
                تصفح الأرقام المميزة
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 h-auto border-2 hover:bg-secondary hover:scale-105 transition-all"
              asChild
            >
              <Link to="/about">
                تعرف على نمرتي
              </Link>
            </Button>
          </div>

          {/* إحصائيات سريعة */}
          <div 
            ref={statsRef}
            className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-700 ${
              statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <StatCard target={10000} label="رقم مميز متاح" />
            <StatCard target={50000} label="عميل راضي" gradient="bg-gradient-accent" />
            <div className="contents">
              <Card className={`bg-secondary/50 border-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground font-medium">دعم فني مستمر</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* شكل هندسي في الخلفية */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;