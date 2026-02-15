import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateStock } from '../../hooks/queries/useAdminProducts';
import { validateStockInput } from '../../utils/adminProductValidation';
import type { Product } from '../../backend';
import { Edit, AlertCircle, Package } from 'lucide-react';

interface ManageProductsTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onEdit: (product: Product) => void;
}

export default function ManageProductsTable({ products, isLoading, onEdit }: ManageProductsTableProps) {
  const updateStock = useUpdateStock();
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});
  const [pendingStockUpdates, setPendingStockUpdates] = useState<Record<string, boolean>>({});

  const handleStockUpdate = async (productId: bigint, newStockValue: string) => {
    const productIdStr = productId.toString();
    const validation = validateStockInput(newStockValue);

    if (!validation.valid) {
      setStockErrors({ ...stockErrors, [productIdStr]: validation.error || 'Invalid stock value' });
      return;
    }

    // Clear error and mark as pending
    setStockErrors({ ...stockErrors, [productIdStr]: '' });
    setPendingStockUpdates({ ...pendingStockUpdates, [productIdStr]: true });

    try {
      await updateStock.mutateAsync({
        productId,
        stock: BigInt(parseInt(newStockValue, 10)),
      });
    } catch (error) {
      console.error('Stock update error:', error);
    } finally {
      setPendingStockUpdates({ ...pendingStockUpdates, [productIdStr]: false });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground">
              Add your first product using the Add/Edit Product tab.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-32">Stock</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const productIdStr = product.id.toString();
                const hasStockError = !!stockErrors[productIdStr];
                const isUpdatingStock = pendingStockUpdates[productIdStr];

                return (
                  <TableRow key={productIdStr}>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/generated/product-placeholder.dim_800x800.png';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.currency} {(Number(product.price) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Input
                          type="number"
                          defaultValue={product.stock.toString()}
                          onBlur={(e) => handleStockUpdate(product.id, e.target.value)}
                          className={`w-24 ${hasStockError ? 'border-destructive' : ''}`}
                          disabled={isUpdatingStock}
                        />
                        {hasStockError && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {stockErrors[productIdStr]}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
