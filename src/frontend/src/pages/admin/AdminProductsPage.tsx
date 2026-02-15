import { useState } from 'react';
import { useListAllProducts } from '../../hooks/queries/useProducts';
import AdminGate from '../../components/admin/AdminGate';
import ProductUpsertForm from '../../components/admin/ProductUpsertForm';
import ManageProductsTable from '../../components/admin/ManageProductsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit } from 'lucide-react';
import type { Product } from '../../backend';

export default function AdminProductsPage() {
  const { data: products, isLoading } = useListAllProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>('add');

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add');
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    setActiveTab('manage');
  };

  const handleFormCancel = () => {
    setEditingProduct(null);
  };

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
            <ProductUpsertForm
              editingProduct={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </TabsContent>

          <TabsContent value="manage">
            <ManageProductsTable
              products={products}
              isLoading={isLoading}
              onEdit={handleEditProduct}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
