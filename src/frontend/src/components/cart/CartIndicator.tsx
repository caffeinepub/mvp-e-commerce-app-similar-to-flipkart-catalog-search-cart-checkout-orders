import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useGetCart } from '../../hooks/queries/useCart';

export default function CartIndicator() {
  const { data: cartItems } = useGetCart();

  const itemCount = cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
