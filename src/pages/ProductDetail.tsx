import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { products } from '../data/products'
import BottomNav from '../components/BottomNav'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const product = products.find(p => p.id === id)
  
  if (!product) {
    return <div className="p-4">Product not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-xl font-bold text-blue-600">Detail Produk</div>
            <button className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pt-16">
        {/* Product Image */}
        <div className="w-full h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Deskripsi</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        {/* Category */}
        <div className="p-4 mt-2 bg-white">
          <h2 className="font-semibold mb-2">Kategori</h2>
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {product.category}
          </div>
        </div>

        {/* Buy Button */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="max-w-lg mx-auto">
            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold">
              Beli Sekarang
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
