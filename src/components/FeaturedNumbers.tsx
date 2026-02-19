import NumberCard from "./NumberCard";
import { useFeaturedPhoneNumbers } from "@/hooks/usePhoneNumbers";
import { SkeletonGrid } from "./Skeleton";
import { useScrollAnimation } from "@/hooks/useAnimations";
import { Link } from "react-router-dom";

const FeaturedNumbers = () => {
  const { data: numbers, isLoading, error } = useFeaturedPhoneNumbers();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SkeletonGrid count={6} />
        </div>
      </section>
    );
  }

  if (error || !numbers || numbers.length === 0) {
    return null;
  }

  const featuredNumbers = numbers.slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            أرقام مميزة 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> مختارة </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مجموعة من أفضل الأرقام المميزة المتاحة حالياً بأسعار تنافسية
          </p>
        </div>

        {/* شبكة الأرقام */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredNumbers.map((numberData, index) => (
            <div 
              key={numberData.id}
              className={`transition-all duration-500 ${
                gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: gridVisible ? `${index * 100}ms` : '0ms' }}
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
          ))}
        </div>

        {/* رابط عرض المزيد */}
        <div className="text-center mt-12">
          <Link 
            to="/numbers" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-lg font-semibold group"
          >
            عرض جميع الأرقام المتاحة
            <svg className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-[-4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNumbers;