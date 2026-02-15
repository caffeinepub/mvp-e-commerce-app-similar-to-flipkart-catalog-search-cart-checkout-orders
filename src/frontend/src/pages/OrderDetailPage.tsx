import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/queries/useOrders';
import { useListAllProducts } from '../hooks/queries/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Banknote } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { getPaymentMethodLabel } from '../utils/paymentMethod';

export default function OrderDetailPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(orderId);
  const { data: allProducts } = useListAllProducts();

  if (isLoading) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading order...</p>
        </div>
      </AuthGate>
    );
  }

  if (!order) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">Order not found</p>
              <Button onClick={() => navigate({ to: '/orders' })}>Back to Orders</Button>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  const orderItems = order.items.map((item) => {
    const product = allProducts?.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const total = Number(order.total) / 100;
  const date = new Date(Number(order.timestamp) / 1000000);

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id.toString()}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
              </p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Package className="h-3 w-3" />
              Placed
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap font-sans">{order.shippingAddress}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{getPaymentMethodLabel(order.paymentMethod)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => {
                if (!item.product) return null;
                const imageUrl = item.product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';
                const price = Number(item.product.price) / 100;
                const quantity = Number(item.quantity);
                const itemTotal = price * quantity;

                return (
                  <div key={item.productId.toString()}>
                    <div className="flex gap-4">
                      <img
                        src={imageUrl}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/generated/product-placeholder.dim_800x800.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        <p className="text-sm mt-1">
                          ₹{price.toFixed(2)} × {quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                );
              })}

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => navigate({ to: '/orders' })} variant="outline">
            Back to Orders
          </Button>
        </div>
      </div>
    </AuthGate>
  );
}
