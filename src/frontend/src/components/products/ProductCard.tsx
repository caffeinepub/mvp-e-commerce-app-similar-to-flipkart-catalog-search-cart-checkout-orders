import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../../backend';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';
  const price = Number(product.price) / 100;
  const rating = product.rating ? Number(product.rating) : null;
  const inStock = Number(product.stock) > 0;

  return (
    <Link to="/product/$productId" params={{ productId: product.id.toString() }}>
      <Card className="h-full hover:shadow-medium transition-all hover:scale-[1.02] cursor-pointer overflow-hidden group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/product-placeholder.dim_800x800.png';
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-primary">
              {product.currency} {price.toFixed(2)}
            </span>
            {!inStock && (
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            )}
          </div>
          {rating !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{rating}/5</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
