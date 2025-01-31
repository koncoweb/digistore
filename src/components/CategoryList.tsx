import { CATEGORIES } from '../data/products';

interface CategoryListProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryList({ selectedCategory, onCategorySelect }: CategoryListProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`flex flex-col items-center gap-2 ${
          selectedCategory === null ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <div className={`w-12 h-12 rounded-full ${
          selectedCategory === null 
            ? 'bg-blue-600 text-white' 
            : 'bg-blue-100 text-blue-600'
        } flex items-center justify-center`}>
          <span className="text-xl font-bold">All</span>
        </div>
        <span className="text-xs text-gray-600">Semua</span>
      </button>
      {CATEGORIES.map((category) => {
        const IconComponent = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.name)}
            className={`flex flex-col items-center gap-2 ${
              selectedCategory === category.name ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${
              selectedCategory === category.name 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-600'
            } flex items-center justify-center`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-600">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
