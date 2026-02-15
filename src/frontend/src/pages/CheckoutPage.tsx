import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart } from '../hooks/queries/useCart';
import { useListAllProducts } from '../hooks/queries/useProducts';
import { usePlaceOrder } from '../hooks/queries/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ShippingAddressForm from '../components/forms/ShippingAddressForm';
import AuthGate from '../components/auth/AuthGate';
import { toast } from 'sonner';
import { PaymentMethod } from '../backend';
import { Banknote, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems } = useGetCart();
  const { data: allProducts } = useListAllProducts();
  const placeOrder = usePlaceOrder();
  const [shippingAddress, setShippingAddress] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const cartWithProducts = cartItems?.map((item) => {
    const product = allProducts?.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartWithProducts?.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0) || 0;

  const isCountryIndia = country.trim().toLowerCase() === 'india';
  const showCountryError = country.trim() !== '' && !isCountryIndia;

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please fill in your shipping address');
      return;
    }

    if (!country.trim()) {
      toast.error('Please enter your country');
      return;
    }

    if (!isCountryIndia) {
      toast.error('We currently only accept orders from India');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderId = await placeOrder.mutateAsync({ shippingAddress, paymentMethod, country });
      navigate({ to: '/order-confirmation/$orderId', params: { orderId: orderId.toString() } });
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate({ to: '/' })}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  const isFormValid = shippingAddress.trim() && country.trim() && isCountryIndia && paymentMethod !== null;

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingAddressForm 
                    onAddressChange={setShippingAddress}
                    onCountryChange={setCountry}
                  />
                  {showCountryError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        We currently only accept orders from India. Please enter "India" as your country.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod || ''}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={PaymentMethod.cod} id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Cash on Delivery (COD)</p>
                          <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartWithProducts?.map((item) => {
                      if (!item.product) return null;
                      const price = Number(item.product.price) / 100;
                      const quantity = Number(item.quantity);
                      return (
                        <div key={item.productId.toString()} className="flex justify-between text-sm">
                          <span className="flex-1 truncate">
                            {item.product.title} × {quantity}
                          </span>
                          <span className="font-semibold">₹{(price * quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

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
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending || !isFormValid}
                    className="w-full"
                    size="lg"
                  >
                    {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
