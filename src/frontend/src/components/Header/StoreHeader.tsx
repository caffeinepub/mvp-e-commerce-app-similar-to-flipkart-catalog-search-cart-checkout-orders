import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginButton from '../auth/LoginButton';
import CartIndicator from '../cart/CartIndicator';
import BrandLogo from '../branding/BrandLogo';
import PrincipalIdDisclosure from '../auth/PrincipalIdDisclosure';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/queries/useUser';
import { useState } from 'react';

export default function StoreHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/products', search: { q: searchQuery.trim() } });
    }
  };

  const showAdminLink = identity && !isAdminLoading && isAdmin === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BrandLogo />
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {identity && (
              <>
                <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                  <Link to="/orders">
                    <Package className="h-5 w-5" />
                  </Link>
                </Button>
                <CartIndicator />
                <PrincipalIdDisclosure />
              </>
            )}
            {showAdminLink && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <LoginButton />
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
