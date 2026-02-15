import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomeHero() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
      <div className="absolute inset-0">
        <img
          src="/assets/generated/home-hero.dim_1600x500.png"
          alt="Shop the best products"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Discover Amazing Products
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Shop from thousands of products across multiple categories with great deals and fast delivery
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/products">
            Start Shopping <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
