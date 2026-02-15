import { useState } from 'react';
import { useListAllProducts } from '../../hooks/queries/useProducts';
import { useAddProduct, useUpdateProduct, useUpdateStock } from '../../hooks/queries/useAdminProducts';
import AdminGate from '../../components/admin/AdminGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit } from 'lucide-react';

export default function AdminProductsPage() {
  const { data: products } = useListAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const updateStock = useUpdateStock();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: '₹',
    category: '',
    imageUrl: '',
    rating: '',
    stock: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      title: formData.title,
      description: formData.description,
      price: BigInt(Math.round(parseFloat(formData.price) * 100)),
      currency: formData.currency,
      category: formData.category,
      imageUrl: formData.imageUrl,
      rating: formData.rating ? BigInt(formData.rating) : null,
      stock: BigInt(formData.stock),
    };

    if (editingId) {
      await updateProduct.mutateAsync({
        productId: BigInt(editingId),
        ...productData,
      });
      setEditingId(null);
    } else {
      await addProduct.mutateAsync(productData);
    }

    setFormData({
      title: '',
      description: '',
      price: '',
      currency: '₹',
      category: '',
      imageUrl: '',
      rating: '',
      stock: '',
    });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id.toString());
    setFormData({
      title: product.title,
      description: product.description,
      price: (Number(product.price) / 100).toString(),
      currency: product.currency,
      category: product.category,
      imageUrl: product.imageUrl,
      rating: product.rating ? product.rating.toString() : '',
      stock: product.stock.toString(),
    });
  };

  const handleStockUpdate = async (productId: bigint, newStock: string) => {
    await updateStock.mutateAsync({
      productId,
      stock: BigInt(newStock),
    });
  };

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add">
              <Plus className="h-4 w-4 mr-2" />
              Add/Edit Product
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Edit className="h-4 w-4 mr-2" />
              Manage Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (in currency) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/assets/generated/product-placeholder.dim_800x800.png"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={addProduct.isPending || updateProduct.isPending}>
                      {editingId ? 'Update Product' : 'Add Product'}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            title: '',
                            description: '',
                            price: '',
                            currency: '₹',
                            category: '',
                            imageUrl: '',
                            rating: '',
                            stock: '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id.toString()}>
                          <TableCell>{product.id.toString()}</TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.currency} {(Number(product.price) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={product.stock.toString()}
                              onBlur={(e) => handleStockUpdate(product.id, e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
