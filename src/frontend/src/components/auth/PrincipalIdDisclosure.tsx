import { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { copyToClipboard } from '@/utils/publicUrl';
import { toast } from 'sonner';

export default function PrincipalIdDisclosure() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!identity) {
    return null;
  }

  const principalId = identity.getPrincipal().toString();

  const handleCopy = async () => {
    const success = await copyToClipboard(principalId);
    if (success) {
      setCopied(true);
      toast.success('Principal ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy. Please copy it manually.');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Your Principal ID</h4>
            <p className="text-xs text-muted-foreground">
              This is your unique Internet Identity identifier
            </p>
          </div>
          <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
            <code className="flex-1 text-xs font-mono break-all leading-relaxed">
              {principalId}
            </code>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Principal ID
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
