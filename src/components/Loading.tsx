const Loading = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;