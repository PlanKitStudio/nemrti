import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Phone, Search, User, ShoppingCart, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-lg' 
        : 'bg-card/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* اللوجو */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
            <div className="bg-gradient-primary p-2 rounded-lg glow-primary group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-right rtl:text-right">
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">نمرتي</h1>
              <p className="text-xs text-muted-foreground">نمرة مميزة بسهولة</p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`relative text-foreground hover:text-primary transition-colors font-medium py-1 ${
              isActive('/') ? 'text-primary' : ''
            }`}>
              الرئيسية
              {isActive('/') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-x" />}
            </Link>
            <Link to="/numbers" className={`relative text-foreground hover:text-primary transition-colors font-medium py-1 ${
              isActive('/numbers') ? 'text-primary' : ''
            }`}>
              الأرقام المميزة
              {isActive('/numbers') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-x" />}
            </Link>
            <Link to="/about" className={`relative text-foreground hover:text-primary transition-colors font-medium py-1 ${
              isActive('/about') ? 'text-primary' : ''
            }`}>
              عن نمرتي
              {isActive('/about') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-x" />}
            </Link>
            <Link to="/blog" className={`relative text-foreground hover:text-primary transition-colors font-medium py-1 ${
              location.pathname.startsWith('/blog') ? 'text-primary' : ''
            }`}>
              المدونة
              {location.pathname.startsWith('/blog') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-x" />}
            </Link>
            <Link to="/contact" className={`relative text-foreground hover:text-primary transition-colors font-medium py-1 ${
              isActive('/contact') ? 'text-primary' : ''
            }`}>
              اتصل بنا
              {isActive('/contact') && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-x" />}
            </Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/favorites">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4 ml-2" />
                      لوحة التحكم
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 ml-2" />
                    حسابي
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <User className="h-4 w-4 ml-2" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button className="bg-gradient-primary glow-primary" size="sm" asChild>
                  <Link to="/numbers">
                    تسوق الآن
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 mt-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/numbers" 
                className="text-foreground hover:text-primary transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                الأرقام
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                عن نمرتي
              </Link>
              <Link 
                to="/blog" 
                className="text-foreground hover:text-primary transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                المدونة
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start relative" asChild>
                  <Link to="/favorites">
                    <Heart className="h-4 w-4 ml-2" />
                    المفضلة
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start relative" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    السلة
                    {itemCount > 0 && (
                      <Badge className="mr-2">
                        {itemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="justify-start" asChild>
                        <Link to="/dashboard">
                          <LayoutDashboard className="h-4 w-4 ml-2" />
                          لوحة التحكم
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/my-orders">
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        طلباتي
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 ml-2" />
                        حسابي
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="justify-center" asChild>
                      <Link to="/auth">
                        <User className="h-4 w-4 ml-2" />
                        تسجيل الدخول
                      </Link>
                    </Button>
                    <Button className="bg-gradient-primary glow-primary justify-center" size="sm" asChild>
                      <Link to="/numbers">
                        تسوق الآن
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;