import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePage } from "@/hooks/usePages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = usePage(slug!);

  useEffect(() => {
    if (page) {
      document.title = `${page.title} - نمرتي`;
      if (page.meta_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', page.meta_description);
        }
      }
    }
  }, [page]);

  if (isLoading) return <Loading />;

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">الصفحة غير موجودة</h2>
              <p className="text-muted-foreground">عذراً، لم نتمكن من العثور على الصفحة المطلوبة.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="text-lg text-muted-foreground">
                {page.meta_description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
                style={{
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Page;
