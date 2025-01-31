import { Product } from '../types';
import { Laptop, BookOpen, Video, Code, Ticket } from 'lucide-react';

export const CATEGORIES = [
  { id: '1', name: 'Software', icon: Laptop },
  { id: '2', name: 'Ebook', icon: BookOpen },
  { id: '3', name: 'Courses', icon: Video },
  { id: '4', name: 'Source Code', icon: Code },
  { id: '5', name: 'Video', icon: Video }
] as const;

export const products: Product[] = [
  {
    id: '1',
    name: 'Netflix Premium 1 Bulan',
    description: 'Akses Netflix Premium selama 1 bulan',
    price: 159000,
    category: 'Video',
    image: 'https://assets.srcbook.com/sample/netflix.jpg',
  },
  {
    id: '2',
    name: 'Spotify Premium 1 Bulan',
    description: 'Langganan Spotify Premium 1 bulan',
    price: 54990,
    category: 'Software',
    image: 'https://assets.srcbook.com/sample/spotify.jpg',
  },
  {
    id: '3',
    name: 'YouTube Premium 1 Bulan',
    description: 'Akses YouTube tanpa iklan selama 1 bulan',
    price: 69000,
    category: 'Video',
    image: 'https://assets.srcbook.com/sample/youtube.jpg',
  },
  {
    id: '4',
    name: 'Mobile Legends 100 Diamonds',
    description: 'Top up 100 Diamonds Mobile Legends',
    price: 28000,
    category: 'Software',
    image: 'https://assets.srcbook.com/sample/ml.jpg',
  },
];
