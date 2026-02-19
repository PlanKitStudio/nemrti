import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdsByPosition } from "@/hooks/useAds";
import { adsAPI, getStorageUrl } from "@/lib/api";

interface AdBannerProps {
  size: "leaderboard" | "rectangle" | "wide" | "sidebar";
  position: string;
  content?: {
    title: string;
    description: string;
    image?: string;
    link?: string;
  };
  isDismissible?: boolean;
}

const AdBanner = ({ size, position, content, isDismissible = false }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const impressionTracked = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Fetch real ads for this position
  const { data: ads } = useAdsByPosition(position);

  // Pick the first active ad (already sorted by priority from backend)
  const activeAd = ads && ads.length > 0 ? ads[0] : null;

  // Track impression when ad becomes visible in viewport
  useEffect(() => {
    if (!activeAd || impressionTracked.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !impressionTracked.current) {
          impressionTracked.current = true;
          adsAPI.trackImpression(activeAd.id, window.location.pathname).catch(() => {});
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // 50% visible
    });

    if (bannerRef.current) {
      observerRef.current.observe(bannerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [activeAd]);

  if (!isVisible) return null;

  const sizeClasses = {
    leaderboard: "w-full max-w-[970px] h-[90px] md:h-[250px]",
    rectangle: "w-[300px] h-[250px]",
    wide: "w-full max-w-[970px] h-[90px]",
    sidebar: "w-[300px] h-[600px]"
  };

  // Use real ad data, fallback to props content, then fallback to placeholder
  const adContent = activeAd
    ? {
        title: activeAd.title,
        description: activeAd.description || '',
        image: getStorageUrl(activeAd.image_url),
        link: activeAd.target_url,
      }
    : content || {
        title: "مساحة إعلانية",
        description: "تواصل معنا للإعلان هنا",
        image: undefined,
        link: undefined,
      };

  const handleClick = () => {
    if (activeAd) {
      adsAPI.trackClick(activeAd.id, window.location.pathname).catch(() => {});
    }
    if (adContent.link) {
      window.open(adContent.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={bannerRef}
      className={`relative bg-muted/30 border border-border rounded-lg overflow-hidden ${sizeClasses[size]} mx-auto`}
    >
      {/* Ad Label */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
          إعلان
        </span>
      </div>

      {/* Dismiss Button */}
      {isDismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-20 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Clickable Ad Content */}
      <div
        className="flex items-center justify-center h-full p-4 cursor-pointer"
        onClick={handleClick}
      >
        <div className="text-center space-y-2">
          {adContent.image && (
            <div className="mb-3">
              <img
                src={adContent.image}
                alt={adContent.title}
                className="max-w-full max-h-20 mx-auto object-contain"
              />
            </div>
          )}
          <h3 className="font-semibold text-foreground text-sm md:text-base">
            {adContent.title}
          </h3>
          {adContent.description && (
            <p className="text-xs md:text-sm text-muted-foreground">
              {adContent.description}
            </p>
          )}
          {adContent.link && (
            <Button size="sm" className="mt-2">
              اكتشف المزيد
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
