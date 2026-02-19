import EnhancedDashboardNav from "@/components/dashboard/EnhancedDashboardNav";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, ExternalLink } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/dashboard/statistics": "الإحصائيات",
  "/dashboard/numbers": "إدارة الأرقام",
  "/dashboard/orders": "إدارة الطلبات",
  "/dashboard/coupons": "إدارة الكوبونات",
  "/dashboard/users": "إدارة المستخدمين",
  "/dashboard/blog": "إدارة المدونة",
  "/dashboard/pages": "إدارة الصفحات",
  "/dashboard/ads": "إدارة الإعلانات",
  "/dashboard/advertising-analytics": "تحليلات الإعلانات",
  "/dashboard/settings": "الإعدادات",
  "/dashboard/contacts": "رسائل التواصل",
  "/dashboard/tracking-scripts": "أكواد التتبع والتحليلات",
  "/dashboard/payment-settings": "إعدادات الدفع",
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitles[location.pathname] || "لوحة التحكم";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless open */}
      <div className={`hidden lg:block`}>
        <EnhancedDashboardNav collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <div className={`lg:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <EnhancedDashboardNav collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main content area */}
      <div
        className={`
          transition-all duration-300
          ${collapsed ? "lg:mr-[72px]" : "lg:mr-64"}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/40">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-muted/60 text-muted-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">{currentTitle}</h1>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/60"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">الموقع</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;