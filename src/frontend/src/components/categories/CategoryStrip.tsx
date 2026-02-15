import { Link } from '@tanstack/react-router';
import { useGetSupportedCategories } from '../../hooks/queries/useProducts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const categoryIcons: Record<string, string> = {
  Electronics: '📱',
  Fashion: '👗',
  Home: '🏠',
  Beauty: '💄',
  Groceries: '🛒',
};

export default function CategoryStrip() {
  const { data: categories, isLoading } = useGetSupportedCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category}
          to="/products"
          search={{ category }}
          className="group"
        >
          <Card className="p-6 text-center hover:shadow-medium transition-all hover:scale-105 cursor-pointer">
            <div className="text-4xl mb-2">{categoryIcons[category] || '📦'}</div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {category}
            </h3>
          </Card>
        </Link>
      ))}
    </div>
  );
}
