import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePages } from "@/hooks/usePages";

const Footer = () => {
  const { data: pages = [] } = usePages();
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">نمرتي</h3>
                <p className="text-sm text-muted-foreground">نمرة مميزة بسهولة</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              منصة نمرتي هي أكبر متجر إلكتروني متخصص في بيع أرقام الموبايل المميزة في مصر. نوفر لك أفضل الأرقام بأسعار تنافسية وضمان كامل.
            </p>
            
            {/* وسائل التواصل الاجتماعي */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/numbers" className="text-muted-foreground hover:text-primary transition-colors">
                  الأرقام المميزة
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  عن نمرتي
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  المدونة
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* الصفحات القانونية */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">معلومات قانونية</h4>
            <ul className="space-y-3">
              {pages.slice(0, 5).map((page) => (
                <li key={page.id}>
                  <Link to={`/page/${page.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات الاتصال والنشرة البريدية */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">تواصل معنا</h4>
            
            {/* معلومات الاتصال */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+20 100 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">info@namrti.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">القاهرة، مصر</span>
              </div>
            </div>

            {/* النشرة البريدية */}
            <div>
              <h5 className="text-md font-semibold text-foreground mb-3">اشترك في النشرة البريدية</h5>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1"
                />
                <Button className="bg-gradient-primary">
                  اشترك
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                احصل على أحدث العروض والأرقام المميزة
              </p>
            </div>
          </div>
        </div>

        {/* خط الفصل وحقوق الطبع */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-right mb-4 md:mb-0">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} نمرتي. جميع الحقوق محفوظة.
              </p>
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse">
              {pages.filter(p => ['privacy-policy', 'terms-conditions', 'refund-policy'].includes(p.slug)).map((page) => (
                <Link 
                  key={page.id}
                  to={`/page/${page.slug}`} 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;