import HomeHero from '../components/branding/HomeHero';
import CategoryStrip from '../components/categories/CategoryStrip';
import ProductGrid from '../components/products/ProductGrid';
import ProductCard from '../components/products/ProductCard';
import { useListAllProducts } from '../hooks/queries/useProducts';

export default function HomePage() {
  const { data: products, isLoading } = useListAllProducts();

  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <HomeHero />

      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <CategoryStrip />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid isLoading={isLoading} isEmpty={featuredProducts.length === 0}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id.toString()} product={product} />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
