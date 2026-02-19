import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useCreateContact } from '@/hooks/useContacts';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const createContact = useCreateContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      },
    });
  };
  const contactInfo = [
    {
      icon: Phone,
      title: "اتصل بنا",
      details: [
        "+20 100 123 4567",
        "+20 111 234 5678"
      ],
      description: "متاح 24/7 لخدمتك"
    },
    {
      icon: Mail,
      title: "راسلنا",
      details: [
        "info@namrti.com",
        "support@namrti.com"
      ],
      description: "نرد خلال ساعات قليلة"
    },
    {
      icon: MapPin,
      title: "عنواننا",
      details: [
        "شارع التحرير، وسط القاهرة",
        "القاهرة، مصر"
      ],
      description: "زورنا في مقرنا الرئيسي"
    },
    {
      icon: Clock,
      title: "مواعيد العمل",
      details: [
        "السبت - الخميس: 9 ص - 9 م",
        "الجمعة: 2 م - 9 م"
      ],
      description: "الدعم الإلكتروني متاح 24/7"
    }
  ];

  const faqItems = [
    {
      question: "كيف يمكنني شراء رقم مميز؟",
      answer: "يمكنك تصفح الأرقام المتاحة واختيار ما يناسبك، ثم إكمال عملية الدفع بسهولة عبر الموقع."
    },
    {
      question: "كم يستغرق تفعيل الرقم؟",
      answer: "التفعيل فوري في معظم الحالات، وقد يستغرق حتى 24 ساعة في أقصى الحالات."
    },
    {
      question: "هل يمكنني إرجاع الرقم؟",
      answer: "نعم، يمكنك إرجاع الرقم خلال 7 أيام من تاريخ الشراء إذا كان هناك مشكلة تقنية."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع عبر البطاقات الائتمانية، فودافون كاش، وإمكانية الدفع عند الاستلام."
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
              تواصل 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> معنا </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن هنا لمساعدتك في أي استفسار أو مشكلة. تواصل معنا بالطريقة التي تناسبك
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="card-elegant text-center group">
                <CardContent className="p-6">
                  <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto mb-4 glow-primary group-hover:scale-110 transition-transform">
                    <info.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and WhatsApp */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">
                    أرسل لنا رسالة
                  </CardTitle>
                  <p className="text-muted-foreground">
                    املأ النموذج وسنتواصل معك في أقرب وقت
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          الاسم الكامل *
                        </label>
                        <Input 
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          رقم الهاتف *
                        </label>
                        <Input 
                          placeholder="أدخل رقم هاتفك"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        البريد الإلكتروني *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="أدخل بريدك الإلكتروني"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        موضوع الرسالة *
                      </label>
                      <Input 
                        placeholder="ما موضوع رسالتك؟"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        تفاصيل الرسالة *
                      </label>
                      <Textarea 
                        placeholder="اكتب رسالتك هنا..." 
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary glow-primary"
                      disabled={createContact.isPending}
                    >
                      <Send className="h-4 w-4 ml-2" />
                      {createContact.isPending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp & Quick Actions */}
            <div className="space-y-6">
              {/* WhatsApp Card */}
              <Card className="card-elegant">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-500 p-4 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    واتساب مباشر
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    تحدث معنا مباشرة عبر الواتساب للحصول على رد سريع
                  </p>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <MessageCircle className="h-4 w-4 ml-2" />
                    فتح واتساب
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">روابط سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/numbers">
                      تصفح الأرقام المميزة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/blog">
                      الأسئلة الشائعة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/about">
                      سياسة الإرجاع
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/about">
                      شروط الخدمة
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              الأسئلة 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> الشائعة </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة التي يطرحها عملاؤنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <Card key={index} className="card-elegant">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">لم تجد إجابة لسؤالك؟</p>
            <Button className="bg-gradient-primary glow-primary">
              <MessageCircle className="h-4 w-4 ml-2" />
              تواصل معنا مباشرة
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact;