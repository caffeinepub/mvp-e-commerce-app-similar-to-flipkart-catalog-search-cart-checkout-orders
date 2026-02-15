import { useParams, Link } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/queries/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import AuthGate from '../components/auth/AuthGate';
import { getPaymentMethodLabel } from '../utils/paymentMethod';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const { data: order, isLoading } = useGetOrder(orderId);

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your order has been confirmed. Order ID: <span className="font-semibold">#{orderId}</span>
            </p>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading order details...</p>
            ) : order ? (
              <div className="bg-accent/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  Payment Method: <span className="font-medium text-foreground">{getPaymentMethodLabel(order.paymentMethod)}</span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Total: <span className="font-bold text-foreground">₹{(Number(order.total) / 100).toFixed(2)}</span>
                </p>
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Thank you for shopping with us! You can track your order status in the Orders page.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild>
                <Link to="/order/$orderId" params={{ orderId }}>
                  View Order Details
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/orders">View All Orders</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
