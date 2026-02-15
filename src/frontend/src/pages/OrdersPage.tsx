import { useListMyOrders } from '../hooks/queries/useOrders';
import OrderCard from '../components/orders/OrderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/auth/AuthGate';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useListMyOrders();

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading orders...</p>
          ) : !orders || orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here!</p>
                <Button onClick={() => navigate({ to: '/' })}>Start Shopping</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id.toString()} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
