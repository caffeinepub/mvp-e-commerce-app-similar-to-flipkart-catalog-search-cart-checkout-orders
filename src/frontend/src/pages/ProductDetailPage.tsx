import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProductById } from '../hooks/queries/useProducts';
import { useAddItemToCart } from '../hooks/queries/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: product, isLoading } = useGetProductById(productId);
  const addToCart = useAddItemToCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Product not found</p>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageUrl = product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';
  const price = Number(product.price) / 100;
  const rating = product.rating ? Number(product.rating) : null;
  const stock = Number(product.stock);
  const inStock = stock > 0;

  const handleAddToCart = async () => {
    if (!identity) {
      login();
      return;
    }

    await addToCart.mutateAsync({
      productId: product.id,
      quantity: BigInt(quantity),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/product-placeholder.dim_800x800.png';
            }}
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {rating !== null && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{rating}/5</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-3xl font-bold text-primary">
              {product.currency} {price.toFixed(2)}
            </p>
            {inStock ? (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <Package className="h-4 w-4" />
                In Stock ({stock} available)
              </p>
            ) : (
              <p className="text-sm text-destructive mt-1">Out of Stock</p>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity">Quantity:</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                  className="w-24"
                />
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                size="lg"
                className="w-full gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {addToCart.isPending ? 'Adding...' : identity ? 'Add to Cart' : 'Sign In to Add to Cart'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
