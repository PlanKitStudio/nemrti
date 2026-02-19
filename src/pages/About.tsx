import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, Award, Phone, Target, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "جميع أرقامنا محققة ومضمونة 100% مع إمكانية الإرجاع في حالة وجود أي مشكلة"
    },
    {
      icon: Zap,
      title: "تفعيل فوري",
      description: "تفعيل الرقم خلال دقائق من إتمام عملية الشراء دون أي تأخير"
    },
    {
      icon: Users,
      title: "دعم العملاء",
      description: "فريق دعم متخصص متاح 24/7 لمساعدتك في أي استفسار أو مشكلة"
    },
    {
      icon: Award,
      title: "أرقام حصرية",
      description: "نوفر أرقام مميزة وحصرية لا تجدها في أي مكان آخر بأسعار تنافسية"
    }
  ];

  const stats = [
    { number: "10,000+", label: "عميل راضي" },
    { number: "500+", label: "رقم مميز" },
    { number: "4", label: "شبكات اتصال" },
    { number: "99%", label: "معدل الرضا" }
  ];

  const team = [
    {
      name: "أحمد محمد",
      role: "المؤسس والمدير التنفيذي",
      description: "خبرة 10 سنوات في مجال الاتصالات والأرقام المميزة"
    },
    {
      name: "فاطمة علي",
      role: "مديرة خدمة العملاء",
      description: "متخصصة في تقديم أفضل تجربة للعملاء والدعم الفني"
    },
    {
      name: "محمد حسن",
      role: "مدير التسويق الرقمي",
      description: "خبير في التسويق الإلكتروني وإدارة المنصات الرقمية"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              عن 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> نمرتي </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نحن منصة نمرتي، أكبر متجر إلكتروني متخصص في بيع أرقام الموبايل المميزة في مصر والشرق الأوسط
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">قصتنا</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  بدأت فكرة نمرتي من حاجة حقيقية في السوق المصري. كان العثور على رقم موبايل مميز 
                  يتطلب البحث في أماكن مختلفة والتفاوض مع عدة أشخاص، مما يجعل العملية معقدة ومرهقة.
                </p>
                <p>
                  في عام 2023، قررنا إنشاء منصة واحدة تجمع كل الأرقام المميزة المتاحة في مكان واحد، 
                  مع ضمان الجودة والشفافية في الأسعار وسهولة عملية الشراء.
                </p>
                <p>
                  اليوم، نمرتي هي المنصة الرائدة في مجال بيع الأرقام المميزة، ونفخر بخدمة آلاف العملاء 
                  الذين وثقوا بنا لاختيار أرقامهم المميزة.
                </p>
              </div>
              <Button className="mt-8 bg-gradient-primary glow-primary" asChild>
                <Link to="/numbers">
                  تصفح أرقامنا المميزة
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-secondary p-8 rounded-2xl card-elegant">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">رؤيتنا</h3>
                <p className="text-muted-foreground">
                  أن نكون المنصة الأولى والأوثق في الشرق الأوسط لبيع الأرقام المميزة
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">رسالتنا</h3>
                <p className="text-muted-foreground">
                  تسهيل الحصول على أرقام مميزة بجودة عالية وأسعار عادلة وخدمة متميزة
                </p>
              </CardContent>
            </Card>

            <Card className="card-elegant text-center">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">قيمنا</h3>
                <p className="text-muted-foreground">
                  الشفافية، الجودة، خدمة العملاء المتميزة، والابتكار في التقنية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              لماذا 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> نمرتي </span>
              ؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نقدم لك تجربة فريدة في عالم الأرقام المميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-elegant text-center group">
                <CardContent className="p-6">
                  <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4 glow-primary group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              فريق 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> العمل </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              فريق متخصص ومتفان لتقديم أفضل خدمة لعملائنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-elegant text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-hero p-12 rounded-2xl text-center card-elegant">
            <Phone className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ابدأ رحلتك مع نمرتي اليوم
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الذين اختاروا نمرتي للحصول على أرقامهم المميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary glow-primary" asChild>
                <Link to="/numbers">
                  تصفح الأرقام المميزة
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  تواصل معنا
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;