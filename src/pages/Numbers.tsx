import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PriceSlider from "@/components/PriceSlider";
import AdvancedFilters from "@/components/AdvancedFilters";
import NumberCard from "@/components/NumberCard";
import AdBanner from "@/components/AdBanner";
import { Search } from "lucide-react";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";
import { SkeletonGrid } from "@/components/Skeleton";

const Numbers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPattern, setSelectedPattern] = useState("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  // جلب البيانات من قاعدة البيانات
  const { data: allNumbers, isLoading, error } = usePhoneNumbers({
    search: searchTerm || undefined,
    provider: selectedNetwork === "all" ? undefined : selectedNetwork,
    price_min: minPrice > 0 ? minPrice : undefined,
    price_max: maxPrice < 100000 ? maxPrice : undefined,
    category_id: selectedCategory === "all" ? undefined : selectedCategory,
    is_featured: showFeaturedOnly || undefined,
    is_available: showAvailableOnly || undefined,
  });

  // تطبيق فلتر النمط على جانب العميل
  const filteredNumbers = (allNumbers || []).filter((number) => {
    if (selectedPattern !== "all" && number.pattern_type !== selectedPattern) {
      return false;
    }
    return true;
  });

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedNetwork("all");
    setMinPrice(0);
    setMaxPrice(100000);
    setSelectedCategory("all");
    setSelectedPattern("all");
    setShowFeaturedOnly(false);
    setShowAvailableOnly(true);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Header Section - احترافي ونظيف */}
      <section className="pt-24 pb-8 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              اختار رقمك 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> المميز</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تصفح أكثر من {allNumbers?.length || 0} رقم مميز من جميع الشبكات
            </p>
          </div>

          {/* Numbers Header Ad */}
          <div className="mb-6">
            <AdBanner 
              size="leaderboard" 
              position="numbers-header"
              content={{
                title: "عروض حصرية على الأرقام المميزة",
                description: "خصومات تصل إلى 30% على مجموعة مختارة",
                link: "/numbers?featured=true"
              }}
            />
          </div>
        </div>
      </section>

      {/* Filters Section - مدمج ونظيف */}
      <section className="py-6 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {/* الصف الأول: البحث والفلاتر الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* البحث */}
              <div className="md:col-span-5 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن رقم... (مثل: 111 أو 123)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-10"
                />
              </div>

              {/* فلتر الشبكة */}
              <div className="md:col-span-3">
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="الشبكة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الشبكات</SelectItem>
                    <SelectItem value="فودافون">فودافون</SelectItem>
                    <SelectItem value="اورنج">أورنج</SelectItem>
                    <SelectItem value="اتصالات">اتصالات</SelectItem>
                    <SelectItem value="وي">وي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* فلتر السعر */}
              <div className="md:col-span-3">
                <PriceSlider 
                  minValue={0}
                  maxValue={100000}
                  onPriceChange={handlePriceChange}
                />
              </div>

              {/* الفلاتر المتقدمة */}
              <div className="md:col-span-1 flex justify-end">
                <AdvancedFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedPattern={selectedPattern}
                  onPatternChange={setSelectedPattern}
                  showFeaturedOnly={showFeaturedOnly}
                  onFeaturedToggle={setShowFeaturedOnly}
                  showAvailableOnly={showAvailableOnly}
                  onAvailableToggle={setShowAvailableOnly}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>

            {/* الصف الثاني: النتائج والفلاتر النشطة */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium text-foreground">
                {isLoading ? "جاري البحث..." : `${filteredNumbers.length} رقم`}
              </div>
              
              {/* الفلاتر النشطة */}
              {(selectedNetwork !== "all" || minPrice > 0 || maxPrice < 100000 || searchTerm || 
                selectedCategory !== "all" || selectedPattern !== "all" || showFeaturedOnly || !showAvailableOnly) && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex flex-wrap gap-2">
                    {selectedNetwork !== "all" && (
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setSelectedNetwork("all")}>
                        {selectedNetwork} ×
                      </Badge>
                    )}
                    {(minPrice > 0 || maxPrice < 100000) && (
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => { setMinPrice(0); setMaxPrice(100000); }}>
                        {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} ج.م ×
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setSearchTerm("")}>
                        {searchTerm} ×
                      </Badge>
                    )}
                    {selectedPattern !== "all" && (
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setSelectedPattern("all")}>
                        {selectedPattern} ×
                      </Badge>
                    )}
                    {showFeaturedOnly && (
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setShowFeaturedOnly(false)}>
                        مميز ×
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleResetFilters}
                      className="h-6 text-xs"
                    >
                      إعادة تعيين الكل
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Grid - نظيف ومرتب */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <SkeletonGrid count={8} />
          ) : filteredNumbers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNumbers.map((numberData, index) => (
                <React.Fragment key={numberData.id}>
                  <div 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 50, 400)}ms`, animationFillMode: 'both' }}
                  >
                    <NumberCard
                      id={numberData.id}
                      number={numberData.number}
                      price={Number(numberData.price)}
                      provider={numberData.provider || "فودافون"}
                      views={numberData.views_count || 0}
                      isAvailable={!numberData.is_sold}
                      isFeatured={numberData.is_featured || false}
                    />
                  </div>
                  {/* Ad Banner every 12 numbers */}
                  {(index + 1) % 12 === 0 && (
                    <div className="col-span-full my-4">
                      <AdBanner 
                        size="wide" 
                        position="numbers-inline"
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
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground mb-6">لم نجد أرقام تطابق معايير البحث</p>
              <Button 
                onClick={handleResetFilters}
                className="bg-gradient-primary"
              >
                إعادة تعيين الفلاتر
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Numbers Footer Ad */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdBanner 
            size="leaderboard" 
            position="numbers-footer"
            content={{
              title: "لم تجد رقمك المثالي؟ تواصل معنا",
              description: "فريقنا جاهز لمساعدتك في إيجاد الرقم المناسب",
              link: "/contact"
            }}
          />
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Numbers;
