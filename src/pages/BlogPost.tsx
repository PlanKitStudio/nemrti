import { useParams, useNavigate } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { getStorageUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { ArrowRight, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useBlogPost(slug || '');

  if (isLoading) return <Loading />;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Button onClick={() => navigate('/blog')}>
            العودة للمدونة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Navbar />
      
      <article className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')}
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للمدونة
        </Button>

        {post.featured_image && (
          <img 
            src={getStorageUrl(post.featured_image)} 
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {post.category && (
            <Badge>{post.category.name}</Badge>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {post.published_at && format(new Date(post.published_at), 'dd MMMM yyyy', { locale: ar })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-sm">{post.views_count || 0} مشاهدة</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            className="whitespace-pre-wrap leading-relaxed"
            style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
          >
            {post.content}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
