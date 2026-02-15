import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/queries/useUser';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import AuthGate from '../auth/AuthGate';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: isAdminQueryLoading, isFetched } = useIsCallerAdmin();

  // If not signed in, show sign-in prompt first
  if (!identity) {
    return <AuthGate>{children}</AuthGate>;
  }

  // Wait for actor and identity to be ready before checking admin status
  const isLoading = actorFetching || !actor || isAdminQueryLoading || !isFetched;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldX className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
