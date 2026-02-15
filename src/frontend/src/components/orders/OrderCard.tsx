import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '../../backend';
import { Package } from 'lucide-react';
import { getPaymentMethodLabel } from '../../utils/paymentMethod';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const total = Number(order.total) / 100;
  const date = new Date(Number(order.timestamp) / 1000000);
  const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <Card className="hover:shadow-medium transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Order #{order.id.toString()}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
          <Badge variant="secondary">
            <Package className="h-3 w-3 mr-1" />
            Placed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{itemCount} item(s)</p>
              <p className="text-lg font-bold text-primary mt-1">₹{total.toFixed(2)}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/order/$orderId" params={{ orderId: order.id.toString() }}>
                View Details
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Payment: <span className="font-medium text-foreground">{getPaymentMethodLabel(order.paymentMethod)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
