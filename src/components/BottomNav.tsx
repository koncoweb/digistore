import { Home, Search, Heart, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between py-2">
          <button 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate('/')}
          >
            <Home className={`h-6 w-6 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Search className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-600">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Heart className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-600">Wishlist</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate('/manage-products')}
          >
            <Settings className={`h-6 w-6 ${isActive('/manage-products') ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-600">Manage</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <User className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-600">Akun</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
