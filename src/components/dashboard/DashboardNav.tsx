import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Phone, 
  Megaphone, 
  Settings, 
  Users, 
  FileText,
  Home
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const DashboardNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'الرئيسية', path: '/dashboard', icon: Home },
    { name: 'الإحصائيات', path: '/dashboard/statistics', icon: BarChart3 },
    { name: 'إدارة الأرقام', path: '/dashboard/numbers', icon: Phone },
    { name: 'إدارة الإعلانات', path: '/dashboard/ads', icon: Megaphone },
    { name: 'إحصائيات الإعلانات', path: '/dashboard/advertising-analytics', icon: BarChart3 },
    { name: 'المستخدمين', path: '/dashboard/users', icon: Users },
    { name: 'المقالات', path: '/dashboard/blog', icon: FileText },
    { name: 'الإعدادات', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="w-64 min-h-screen bg-card border-l border-border p-4 fixed right-0 top-0 z-50">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">لوحة التحكم</h2>
        <p className="text-sm text-muted-foreground">إدارة منصة نمرتي</p>
      </div>
      
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  isActive ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-8 pt-8 border-t border-border">
        <Link to="/">
          <Button variant="outline" className="w-full">
            العودة للموقع
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNav;