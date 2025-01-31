export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featuredImage?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
}
