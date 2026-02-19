import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Clock,
  Star,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'scheduled';
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares?: number;
  featured: boolean;
  slug: string;
  readingTime?: number;
  featuredImage?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onToggleFeatured: (postId: string) => void;
}

const BlogPostCard = ({ post, onEdit, onDelete, onToggleFeatured }: BlogPostCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'scheduled': return 'مجدول';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const engagementRate = post.views > 0 ? ((post.likes + post.comments + (post.shares || 0)) / post.views * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] overflow-hidden">
      {/* Featured Image */}
      {post.featuredImage && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          {post.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                <Star className="w-3 h-3 mr-1" />
                مميز
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <Badge className={getStatusColor(post.status)}>
              {getStatusText(post.status)}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            {!post.featuredImage && post.featured && (
              <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 mt-2">
                <Star className="w-3 h-3 mr-1" />
                مميز
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!post.featuredImage && (
              <Badge className={getStatusColor(post.status)}>
                {getStatusText(post.status)}
              </Badge>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(post)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  تحرير المقال
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFeatured(post.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  {post.featured ? 'إلغاء التمييز' : 'تمييز المقال'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(post.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف المقال
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Category and Reading Time */}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          {post.readingTime && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime} دقيقة</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        {/* Author and Date */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Separator className="mb-4" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">المشاهدات</span>
              </div>
              <span className="font-medium">{post.views.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">الإعجابات</span>
              </div>
              <span className="font-medium">{post.likes.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">التعليقات</span>
              </div>
              <span className="font-medium">{post.comments}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">التفاعل</span>
              </div>
              <span className="font-medium">{engagementRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                engagementRate > 5 ? 'bg-green-500' : 
                engagementRate > 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(engagementRate * 10, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground">
            {engagementRate > 5 ? 'أداء ممتاز' : 
             engagementRate > 2 ? 'أداء جيد' : 'يحتاج تحسين'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(post)}
            className="flex-1"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            تحرير
          </Button>
          
          <Button
            variant={post.featured ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleFeatured(post.id)}
          >
            <Star className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;