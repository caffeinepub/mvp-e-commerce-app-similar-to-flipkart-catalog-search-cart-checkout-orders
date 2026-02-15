import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddProduct, useUpdateProduct } from '../../hooks/queries/useAdminProducts';
import { useGetSupportedCategories } from '../../hooks/queries/useProducts';
import { validateProductForm, parseProductFormData, type ProductFormData, type ValidationErrors } from '../../utils/adminProductValidation';
import type { Product } from '../../backend';
import { AlertCircle, ImageOff } from 'lucide-react';

interface ProductUpsertFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductUpsertForm({ editingProduct, onSuccess, onCancel }: ProductUpsertFormProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useGetSupportedCategories();

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    currency: '₹',
    category: '',
    imageUrl: '',
    rating: '',
    stock: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        description: editingProduct.description,
        price: (Number(editingProduct.price) / 100).toString(),
        currency: editingProduct.currency,
        category: editingProduct.category,
        imageUrl: editingProduct.imageUrl,
        rating: editingProduct.rating ? editingProduct.rating.toString() : '',
        stock: editingProduct.stock.toString(),
      });
      setImageLoadError(false);
    } else {
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
      setImageLoadError(false);
    }
    setErrors({});
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const productData = parseProductFormData(formData);

      if (editingProduct) {
        await updateProduct.mutateAsync({
          productId: editingProduct.id,
          ...productData,
        });
      } else {
        await addProduct.mutateAsync(productData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setImageLoadError(false);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  );

  const imagePreviewUrl = formData.imageUrl.trim() || '/assets/generated/product-placeholder.dim_800x800.png';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                  className={errors.category ? 'border-destructive' : ''}
                  placeholder="Type or select a category"
                />
                {errors.category && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </p>
                )}
                {showCategorySuggestions && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                        onMouseDown={() => {
                          setFormData({ ...formData, category: cat });
                          setShowCategorySuggestions(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (in currency) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={errors.stock ? 'border-destructive' : ''}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5, optional)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className={errors.rating ? 'border-destructive' : ''}
                  placeholder="Leave empty for no rating"
                />
                {errors.rating && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.rating}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className={errors.imageUrl ? 'border-destructive' : ''}
                  placeholder="/assets/generated/product-placeholder.dim_800x800.png"
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.imageUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Image Preview */}
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="border rounded-lg overflow-hidden bg-muted aspect-square flex items-center justify-center">
                {imageLoadError ? (
                  <div className="text-center p-4">
                    <ImageOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Failed to load image</p>
                    <p className="text-xs text-muted-foreground mt-1">Check the URL and try again</p>
                  </div>
                ) : (
                  <img
                    src={imagePreviewUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={() => setImageLoadError(true)}
                    onLoad={() => setImageLoadError(false)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={addProduct.isPending || updateProduct.isPending}
            >
              {addProduct.isPending || updateProduct.isPending
                ? 'Saving...'
                : editingProduct
                ? 'Update Product'
                : 'Add Product'}
            </Button>
            {editingProduct && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
