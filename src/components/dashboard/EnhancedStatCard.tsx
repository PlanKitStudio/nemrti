import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  description?: string;
  trend?: number[];
  color?: string;
  premium?: boolean;
}

const EnhancedStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  description, 
  trend,
  color = "from-blue-500 to-purple-600",
  premium = false
}: EnhancedStatCardProps) => {
  return (
    <Card className={`
      relative overflow-hidden group transition-all duration-500 hover:scale-105
      ${premium ? 'card-premium animate-pulse-glow' : 'card-floating'}
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      {/* Gradient Overlay */}
      <div 
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {title}
          {premium && (
            <Badge variant="secondary" className="bg-gradient-premium text-white border-0 text-xs">
              متميز
            </Badge>
          )}
        </CardTitle>
        
        {/* Icon Container */}
        <div className={`
          relative p-3 rounded-xl bg-gradient-to-br ${color} 
          shadow-premium group-hover:shadow-glow transition-all duration-300
          group-hover:scale-110
        `}>
          <Icon className="h-5 w-5 text-white" />
          
          {/* Pulse Animation */}
          <div className={`
            absolute inset-0 rounded-xl bg-gradient-to-br ${color} opacity-50 
            animate-ping group-hover:animate-pulse
          `} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {/* Main Value */}
        <div className="flex items-end gap-2 mb-2">
          <div className={`
            text-3xl font-bold transition-all duration-300
            ${premium ? 'text-gradient-premium' : 'text-foreground'}
          `}>
            {value}
          </div>
          
          {/* Change Indicator */}
          {change && (
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${change.type === 'increase' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-red-500/10 text-red-500'
              }
            `}>
              {change.type === 'increase' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change.value}%
            </div>
          )}
        </div>
        
        {/* Trend Line */}
        {trend && (
          <div className="flex items-end gap-1 mb-2 h-8">
            {trend.map((point, index) => (
              <div
                key={index}
                className={`
                  w-1 bg-gradient-to-t ${color} rounded-full opacity-60
                  hover:opacity-100 transition-all duration-300
                `}
                style={{ 
                  height: `${(point / Math.max(...trend)) * 100}%`,
                  animationDelay: `${index * 50}ms`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Progress Bar */}
        {change && (
          <div className="mt-3 w-full bg-muted/20 rounded-full h-1 overflow-hidden">
            <div 
              className={`
                h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out
              `}
              style={{ 
                width: `${Math.min(Math.abs(change.value), 100)}%`,
                animationDelay: '300ms'
              }}
            />
          </div>
        )}
      </CardContent>
      
      {/* Hover Glow Effect */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 
        bg-gradient-to-br ${color} transition-all duration-500
      `} />
    </Card>
  );
};

export default EnhancedStatCard;