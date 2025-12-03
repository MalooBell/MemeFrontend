import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Chargement...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizes[size]} text-blue-500 animate-spin`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
