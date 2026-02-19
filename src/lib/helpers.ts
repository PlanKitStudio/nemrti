// دوال مساعدة للتطبيق

export const getNetworkColor = (network: string) => {
  const colors = {
    vodafone: 'bg-red-500',
    orange: 'bg-orange-500', 
    etisalat: 'bg-green-500',
    we: 'bg-purple-500'
  };
  return colors[network as keyof typeof colors] || 'bg-gray-500';
};

export const getNetworkName = (network: string) => {
  const names = {
    vodafone: 'فودافون',
    orange: 'أورانج',
    etisalat: 'اتصالات',
    we: 'WE'
  };
  return names[network as keyof typeof names] || network;
};

export const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('ar-EG').format(numPrice || 0) + ' ج.م';
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-EG');
};
