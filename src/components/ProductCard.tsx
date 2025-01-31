import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition hover:shadow-md"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-blue-600 font-bold">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button 
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle buy action
            }}
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
