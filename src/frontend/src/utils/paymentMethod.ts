import { PaymentMethod } from '../backend';

/**
 * Convert backend PaymentMethod enum to human-friendly label
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.cod:
      return 'Cash on Delivery (COD)';
    default:
      return 'Unknown Payment Method';
  }
}
