import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, Star, Package } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface AdvancedFiltersProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPattern: string;
  onPatternChange: (value: string) => void;
  showFeaturedOnly: boolean;
  onFeaturedToggle: (value: boolean) => void;
  showAvailableOnly: boolean;
  onAvailableToggle: (value: boolean) => void;
  onResetFilters: () => void;
}

const AdvancedFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedPattern,
  onPatternChange,
  showFeaturedOnly,
  onFeaturedToggle,
  showAvailableOnly,
  onAvailableToggle,
  onResetFilters,
}: AdvancedFiltersProps) => {
  const { data: categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPattern !== "all" ? 1 : 0) +
    (showFeaturedOnly ? 1 : 0) +
    (showAvailableOnly ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-5 w-5 ml-2" />
          فلاتر متقدمة
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            فلاتر متقدمة
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* فلتر الفئة */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              الفئة
            </Label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلتر النوع/النمط */}
          <div className="space-y-2">
            <Label>نوع الرقم</Label>
            <Select value={selectedPattern} onValueChange={onPatternChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="متتالي">متتالي (123، 456)</SelectItem>
                <SelectItem value="مكرر">مكرر (111، 222)</SelectItem>
                <SelectItem value="مرآة">مرآة (121، 343)</SelectItem>
                <SelectItem value="تتابع">تتابع (135، 246)</SelectItem>
                <SelectItem value="خاص">خاص (000، 999)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* فلتر الأرقام المميزة فقط */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                الأرقام المميزة فقط
              </Label>
              <p className="text-xs text-muted-foreground">
                عرض الأرقام المميزة VIP فقط
              </p>
            </div>
            <Switch
              checked={showFeaturedOnly}
              onCheckedChange={onFeaturedToggle}
            />
          </div>

          {/* فلتر الأرقام المتاحة فقط */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-0.5">
              <Label>الأرقام المتاحة فقط</Label>
              <p className="text-xs text-muted-foreground">
                إخفاء الأرقام المباعة
              </p>
            </div>
            <Switch
              checked={showAvailableOnly}
              onCheckedChange={onAvailableToggle}
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                onResetFilters();
                setIsOpen(false);
              }}
            >
              إعادة تعيين
            </Button>
            <Button 
              className="flex-1 bg-gradient-primary"
              onClick={() => setIsOpen(false)}
            >
              تطبيق الفلاتر
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
