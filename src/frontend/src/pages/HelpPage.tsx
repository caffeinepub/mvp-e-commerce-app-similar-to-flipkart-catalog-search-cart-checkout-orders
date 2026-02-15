import { useState } from 'react';
import { Copy, Check, ExternalLink, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getPublicUrl, copyToClipboard } from '@/utils/publicUrl';

export default function HelpPage() {
  const [copied, setCopied] = useState(false);
  const publicUrl = getPublicUrl();

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy URL. Please copy it manually.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Help & Information</h1>
          <p className="text-muted-foreground">
            Everything you need to know about sharing and promoting your Buyflow marketplace
          </p>
        </div>

        {/* Website URL Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Your Website URL
            </CardTitle>
            <CardDescription>
              Share this URL with customers so they can access your marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono break-all">{publicUrl}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </>
                )}
              </Button>
            </div>
            <Alert>
              <AlertDescription>
                Anyone with this URL can open your Buyflow marketplace in any browser (Chrome, Safari, Firefox, etc.)
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Separator />

        {/* Google Search Indexing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Making Buyflow Discoverable on Google
            </CardTitle>
            <CardDescription>
              Steps to get your marketplace listed in Google Search results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm">
                For your Buyflow marketplace to appear in Google Search, you need to submit it to Google Search Console. Here's how:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>
                  <strong>Go to Google Search Console:</strong> Visit{' '}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    search.google.com/search-console
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <strong>Add your property:</strong> Click "Add Property" and enter your website URL (shown above)
                </li>
                <li>
                  <strong>Verify ownership:</strong> Follow Google's verification steps to prove you own the website
                </li>
                <li>
                  <strong>Submit your sitemap:</strong> In Search Console, submit your sitemap URL: <code className="bg-muted px-1 py-0.5 rounded text-xs">{publicUrl}/sitemap.xml</code>
                </li>
                <li>
                  <strong>Request indexing:</strong> Use the URL Inspection tool to request indexing for your homepage
                </li>
              </ol>

              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> After submission, it may take a few days to several weeks for Google to crawl and index your website. Once indexed, people can find your marketplace by searching "Buyflow" or related keywords.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Custom Domain Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Custom Domain Setup
            </CardTitle>
            <CardDescription>
              Using your own domain name (e.g., www.yourbusiness.com)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              If you want to use a custom domain name instead of the default URL, you'll need to:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
              <li>
                <strong>Purchase a domain:</strong> Buy a domain name from a domain registrar (e.g., GoDaddy, Namecheap, Google Domains)
              </li>
              <li>
                <strong>Configure DNS settings:</strong> Update your domain's DNS records to point to your Buyflow deployment
              </li>
              <li>
                <strong>Update deployment configuration:</strong> Configure your hosting platform to recognize your custom domain
              </li>
            </ol>

            <Alert>
              <AlertDescription>
                <strong>Note:</strong> Custom domain and DNS configuration is an external setup step that must be done through your domain registrar and hosting provider. This is not handled by the Buyflow application code itself.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Separator />

        {/* Additional Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Tips for Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Share on social media:</strong> Post your Buyflow URL on Facebook, Instagram, WhatsApp, and other platforms
              </li>
              <li>
                <strong>Create a QR code:</strong> Generate a QR code for your URL that customers can scan with their phones
              </li>
              <li>
                <strong>Add to business listings:</strong> Include your URL in Google My Business, local directories, and business cards
              </li>
              <li>
                <strong>Email marketing:</strong> Send your URL to existing customers via email newsletters
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
