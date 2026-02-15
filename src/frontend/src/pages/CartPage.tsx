import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/queries/useCart';
import { useListAllProducts } from '../hooks/queries/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useGetCart();
  const { data: allProducts } = useListAllProducts();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const cartWithProducts = cartItems?.map((item) => {
    const product = allProducts?.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartWithProducts?.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0) || 0;

  const handleUpdateQuantity = async (productId: bigint, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateItem.mutateAsync({ productId, quantity: BigInt(newQuantity) });
  };

  const handleRemove = async (productId: bigint) => {
    await removeItem.mutateAsync(productId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart.mutateAsync();
    }
  };

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {cartItems && cartItems.length > 0 && (
              <Button variant="outline" onClick={handleClearCart} disabled={clearCart.isPending}>
                Clear Cart
              </Button>
            )}
          </div>

          {cartLoading ? (
            <p className="text-center text-muted-foreground">Loading cart...</p>
          ) : !cartItems || cartItems.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                <Button onClick={() => navigate({ to: '/' })}>Continue Shopping</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartWithProducts?.map((item) => {
                  if (!item.product) return null;
                  const imageUrl = item.product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';
                  const price = Number(item.product.price) / 100;
                  const quantity = Number(item.quantity);
                  const itemTotal = price * quantity;

                  return (
                    <Card key={item.productId.toString()}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={imageUrl}
                            alt={item.product.title}
                            className="w-24 h-24 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/generated/product-placeholder.dim_800x800.png';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.product.category}</p>
                            <p className="text-lg font-bold text-primary">
                              {item.product.currency} {price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.productId)}
                              disabled={removeItem.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                max={Number(item.product.stock)}
                                value={quantity}
                                onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                className="w-20"
                                disabled={updateItem.isPending}
                              />
                            </div>
                            <p className="text-sm font-semibold">
                              Total: ₹{itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{(subtotal / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{(subtotal / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate({ to: '/checkout' })}
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
