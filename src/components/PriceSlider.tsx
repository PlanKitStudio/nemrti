import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceSliderProps {
  minValue: number;
  maxValue: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceSlider = ({ minValue, maxValue, onPriceChange }: PriceSliderProps) => {
  const [priceRange, setPriceRange] = useState([minValue, maxValue]);

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value);
    onPriceChange(value[0], value[1]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(0, Math.min(Number(e.target.value), priceRange[1] - 1000));
    setPriceRange([newMin, priceRange[1]]);
    onPriceChange(newMin, priceRange[1]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(priceRange[0] + 1000, Number(e.target.value));
    setPriceRange([priceRange[0], newMax]);
    onPriceChange(priceRange[0], newMax);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">نطاق السعر</Label>
        <span className="text-sm text-muted-foreground">جنيه مصري</span>
      </div>
      
      <Slider
        value={priceRange}
        onValueChange={handleSliderChange}
        max={50000}
        min={0}
        step={500}
        className="w-full"
      />
      
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">من</Label>
          <Input
            type="number"
            value={priceRange[0]}
            onChange={handleMinInputChange}
            className="h-8 text-sm"
            min={0}
            step={500}
          />
        </div>
        <div className="text-muted-foreground">-</div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">إلى</Label>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxInputChange}
            className="h-8 text-sm"
            min={1000}
            step={500}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;