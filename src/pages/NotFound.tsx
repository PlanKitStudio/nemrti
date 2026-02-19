import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 tracked via route — no console output in production
    document.title = '404 - الصفحة غير موجودة | نمرتي';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              404
            </div>
            <div className="text-6xl mb-6">🔍</div>
          </div>

          {/* Content */}
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              الصفحة غير موجودة
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                className="bg-gradient-primary glow-primary"
              >
                <a href="/">
                  <Home className="h-4 w-4 ml-2" />
                  العودة للرئيسية
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                asChild
              >
                <a href="/numbers">
                  <Search className="h-4 w-4 ml-2" />
                  تصفح الأرقام
                </a>
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">روابط مفيدة:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="/about" className="text-primary hover:text-primary/80 transition-colors">
                  عن نمرتي
                </a>
                <a href="/contact" className="text-primary hover:text-primary/80 transition-colors">
                  اتصل بنا
                </a>
                <a href="/numbers" className="text-primary hover:text-primary/80 transition-colors">
                  الأرقام المميزة
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
