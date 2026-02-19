import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  BarChart3, 
  Phone, 
  Megaphone, 
  Users, 
  MessageSquare, 
  Mail,
  Settings,
  Home,
  TrendingUp,
  Ticket,
  ShoppingBag,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Code2,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedDashboardNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navSections = [
  {
    label: "الرئيسية",
    items: [
      { name: "لوحة التحكم", path: "/dashboard", icon: LayoutDashboard },
      { name: "الإحصائيات", path: "/dashboard/statistics", icon: BarChart3 },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { name: "الأرقام", path: "/dashboard/numbers", icon: Phone },
      { name: "الطلبات", path: "/dashboard/orders", icon: ShoppingBag },
      { name: "الكوبونات", path: "/dashboard/coupons", icon: Ticket },
      { name: "المستخدمين", path: "/dashboard/users", icon: Users },
      { name: "رسائل التواصل", path: "/dashboard/contacts", icon: Mail },
      { name: "إعدادات الدفع", path: "/dashboard/payment-settings", icon: Wallet },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { name: "المدونة", path: "/dashboard/blog", icon: MessageSquare },
      { name: "الصفحات", path: "/dashboard/pages", icon: FileText },
      { name: "الإعلانات", path: "/dashboard/ads", icon: Megaphone },
    ],
  },
  {
    label: "التحليلات",
    items: [
      { name: "تحليلات الإعلانات", path: "/dashboard/advertising-analytics", icon: TrendingUp },
      { name: "أكواد التتبع", path: "/dashboard/tracking-scripts", icon: Code2 },
    ],
  },
];

const EnhancedDashboardNav = ({ collapsed, onToggle }: EnhancedDashboardNavProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        fixed right-0 top-0 h-screen z-40 border-l border-border/40
        bg-card/95 backdrop-blur-xl
        transition-all duration-300 ease-in-out
        flex flex-col
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border/40 px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-lg">ن</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-base font-bold truncate">نمرتي</h2>
            <p className="text-[11px] text-muted-foreground truncate">لوحة التحكم</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {navSections.map((section, sIdx) => (
          <div key={section.label}>
            {sIdx > 0 && <Separator className="my-2 opacity-40" />}
            {!collapsed && (
              <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}>
                    <button
                      className={`
                        w-full flex items-center gap-3 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
                        ${active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }
                      `}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/40 p-2 space-y-1">
        {/* Settings */}
        <Link to="/dashboard/settings">
          <button
            className={`
              w-full flex items-center gap-3 rounded-lg text-sm font-medium
              transition-all duration-200
              ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
              ${isActive("/dashboard/settings")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }
            `}
            title={collapsed ? "الإعدادات" : undefined}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="truncate">الإعدادات</span>}
          </button>
        </Link>

        <Separator className="opacity-40" />

        {/* User + collapse */}
        <div className={`flex items-center ${collapsed ? "flex-col gap-2 py-2" : "gap-2 p-2"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.name || "المدير"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={collapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {collapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Back to site */}
        <Link to="/" className="block">
          <button
            className={`
              w-full flex items-center gap-2 rounded-lg text-[13px]
              text-muted-foreground hover:text-foreground hover:bg-muted/60
              transition-all duration-200
              ${collapsed ? "justify-center px-2 py-2" : "px-3 py-2"}
            `}
            title={collapsed ? "العودة للموقع" : undefined}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && <span>العودة للموقع</span>}
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default EnhancedDashboardNav;