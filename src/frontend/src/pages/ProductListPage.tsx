import { useSearch } from '@tanstack/react-router';
import ProductGrid from '../components/products/ProductGrid';
import ProductCard from '../components/products/ProductCard';
import { useListAllProducts, useListProductsByCategory, useSearchProducts } from '../hooks/queries/useProducts';
import { Badge } from '@/components/ui/badge';

export default function ProductListPage() {
  const search = useSearch({ strict: false }) as { category?: string; q?: string };
  const category = search.category || null;
  const keyword = search.q || null;

  const { data: allProducts, isLoading: loadingAll } = useListAllProducts();
  const { data: categoryProducts, isLoading: loadingCategory } = useListProductsByCategory(category);
  const { data: searchResults, isLoading: loadingSearch } = useSearchProducts(keyword);

  const products = keyword ? searchResults : category ? categoryProducts : allProducts;
  const isLoading = keyword ? loadingSearch : category ? loadingCategory : loadingAll;

  const title = keyword
    ? `Search results for "${keyword}"`
    : category
    ? `${category} Products`
    : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {products && products.length > 0 && (
          <Badge variant="secondary">{products.length} products found</Badge>
        )}
      </div>

      <ProductGrid
        isLoading={isLoading}
        isEmpty={!products || products.length === 0}
        emptyMessage={
          keyword
            ? `No products found for "${keyword}"`
            : category
            ? `No products found in ${category}`
            : 'No products available'
        }
      >
        {products?.map((product) => (
          <ProductCard key={product.id.toString()} product={product} />
        ))}
      </ProductGrid>
    </div>
  );
}
