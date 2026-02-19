import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Numbers from "./pages/Numbers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import NumberDetails from "./pages/NumberDetails";
import BlogPost from "./pages/BlogPost";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Page from "./pages/Page";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import NumbersManagement from "./pages/dashboard/NumbersManagement";
import AdsManagement from "./pages/dashboard/AdsManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import BlogManagementNew from "./pages/dashboard/BlogManagementNew";
import PagesManagement from "./pages/dashboard/PagesManagement";
import Statistics from "./pages/dashboard/Statistics";
import AdvertisingAnalytics from "./pages/dashboard/AdvertisingAnalytics";
import Settings from "./pages/dashboard/Settings";
import CouponsManagement from "./pages/dashboard/CouponsManagement";
import OrdersManagement from "./pages/dashboard/OrdersManagement";
import ContactsManagement from "./pages/dashboard/ContactsManagement";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import BackToTop from "./components/BackToTop";
import FacebookPixel from "./components/FacebookPixel";import ScriptInjector from './components/ScriptInjector';
import TrackingScriptsManagement from './pages/dashboard/TrackingScriptsManagement';
import PaymentSettings from './pages/dashboard/PaymentSettings';import { CACHE } from "./lib/cache-config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE.DYNAMIC,
      gcTime: CACHE.GC_TIME,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/numbers" element={<Numbers />} />
            <Route path="/numbers/:id" element={<NumberDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="numbers" element={<NumbersManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="ads" element={<AdsManagement />} />
              <Route path="advertising-analytics" element={<AdvertisingAnalytics />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="blog" element={<BlogManagementNew />} />
              <Route path="pages" element={<PagesManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="coupons" element={<CouponsManagement />} />
              <Route path="contacts" element={<ContactsManagement />} />
              <Route path="tracking-scripts" element={<TrackingScriptsManagement />} />
              <Route path="payment-settings" element={<PaymentSettings />} />
            </Route>
            <Route path="/page/:slug" element={<Page />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
          <FacebookPixel />
          <ScriptInjector />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
