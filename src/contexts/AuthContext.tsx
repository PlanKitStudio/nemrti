import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';
import { fbqTrackRegistration } from '@/lib/facebook-pixel';

interface User {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (name: string, email: string, password: string, passwordConfirmation: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkIsAdmin = (roles?: string[]) => 
  roles?.includes('admin') || roles?.includes('super-admin') || false;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(checkIsAdmin(parsedUser.roles));
        
        // Verify token is still valid
        authAPI.getProfile().then(({ data }) => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          setIsAdmin(checkIsAdmin(data.roles));
        }).catch(() => {
          // Token is invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAdmin(false);
        }).finally(() => {
          setIsLoading(false);
        });
      } catch (_error) {
        // Corrupted saved user data — clear and continue
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getProfile();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setIsAdmin(checkIsAdmin(data.roles));
    } catch (_error) {
      // Silently fail — user will need to re-login
    }
  };

  const signUp = async (name: string, email: string, password: string, passwordConfirmation: string, phone?: string) => {
    try {
      const response = await authAPI.register(name, email, password, passwordConfirmation, phone);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAdmin(checkIsAdmin(response.user.roles));
        
        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: 'مرحباً بك! تم تسجيل دخولك تلقائياً',
        });
        
        fbqTrackRegistration();
        navigate('/');
        return { error: null };
      }
      
      return { error: new Error('فشل التسجيل') };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب';
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAdmin(checkIsAdmin(response.user.roles));
        
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بعودتك!',
        });
        
        // Navigate to dashboard if admin, otherwise home
        if (checkIsAdmin(response.user.roles)) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
        
        return { error: null };
      }
      
      return { error: new Error('فشل تسجيل الدخول') };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (_error) {
      // Logout API may fail but we still clear local state
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: 'تم تسجيل الخروج',
        description: 'نراك قريباً!',
      });
      
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signUp, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
