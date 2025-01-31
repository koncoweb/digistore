import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { Product, ProductFormData } from '../types'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { CATEGORIES } from '../data/products'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [tempImage, setTempImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: CATEGORIES[0].name,
  })

  useEffect(() => {
    fetchProducts()
    const savedImage = localStorage.getItem('tempProductImage')
    if (savedImage) {
      setTempImage(savedImage)
    }
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (imageData: string) => {
    setTempImage(imageData)
  }

  const uploadImageToFirebase = async (imageData: string): Promise<string> => {
    if (!imageData) return ''
    
    try {
      const storageRef = ref(storage, `products/${Date.now()}-${Math.random().toString(36).substring(7)}`)
      await uploadString(storageRef, imageData, 'data_url')
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (!tempImage) {
        throw new Error('Please upload an image')
      }

      let imageUrl = ''
      
      if (tempImage) {
        imageUrl = await uploadImageToFirebase(tempImage)
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: imageUrl,
        featuredImage: imageUrl,
        updatedAt: new Date().toISOString()
      }

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData)
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        })
      }
      
      localStorage.removeItem('tempProductImage')
      setTempImage('')
      
      await fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error instanceof Error ? error.message : 'Failed to save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteDoc(doc(db, 'products', productId))
        await fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        setError('Failed to delete product. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const openModal = (product?: Product) => {
    setError(null)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      })
      setTempImage(product.featuredImage || '')
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: CATEGORIES[0].name,
      })
      setTempImage('')
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: CATEGORIES[0].name,
    })
    setTempImage('')
    setError(null)
    localStorage.removeItem('tempProductImage')
  }

  if (isLoading && !isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="max-w-lg mx-auto pt-16">
        {/* Banner */}
        <div className="px-4 py-4">
          <div className="bg-blue-600 rounded-xl p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Product Manager</h2>
              <p className="mt-1 text-sm opacity-90">Manage your digital products</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found. Add your first product!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  initialImage={editingProduct?.featuredImage}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
