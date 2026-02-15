import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { HelpCircle } from 'lucide-react';
import StoreHeader from '../Header/StoreHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} Buyflow. All rights reserved.</p>
              <Link
                to="/help"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Link>
            </div>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
