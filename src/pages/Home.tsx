import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Header from '../components/Header'
import CategoryList from '../components/CategoryList'
import ProductCard from '../components/ProductCard'
import BottomNav from '../components/BottomNav'
import { Product } from '../types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const querySnapshot = await getDocs(collection(db, 'products'))
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setProducts(productsData)
      setFilteredProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="max-w-lg mx-auto pt-16">
        {/* Banner */}
        <div className="px-4 py-4">
          <div className="bg-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold">Selamat Datang!</h2>
            <p className="mt-1 text-sm opacity-90">Temukan produk digital terbaik untuk Anda</p>
          </div>
        </div>

        {/* Categories */}
        <CategoryList 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Products */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {selectedCategory ? `Produk ${selectedCategory}` : 'Semua Produk'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} produk
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedCategory 
                ? `Tidak ada produk dalam kategori ${selectedCategory}`
                : 'Tidak ada produk tersedia'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
