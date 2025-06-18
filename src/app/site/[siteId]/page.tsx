'use client';

import { useEffect, useState }
from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { GeneratedSite } from '@/types';
import { RenderedHtml } from '@/components/RenderedHtml';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Head from 'next/head';


const LOCAL_STORAGE_SITES_KEY = 'webforge_ai_generated_sites';

export default function SitePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const siteId = params.siteId as string;

  const [siteData, setSiteData] = useState<GeneratedSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (siteId) {
      try {
        const storedSites = localStorage.getItem(LOCAL_STORAGE_SITES_KEY);
        if (storedSites) {
          const sites: GeneratedSite[] = JSON.parse(storedSites);
          const currentSite = sites.find((s) => s.id === siteId);
          if (currentSite) {
            setSiteData(currentSite);
          } else {
            // Site not found, could redirect or show a 'not found' message
            toast({ variant: "destructive", title: "Error", description: "Site not found." });
            // router.push('/'); // Optionally redirect
            notFound(); // Use Next.js notFound
          }
        } else {
           // No sites stored, implies an issue or direct navigation without generation
           toast({ variant: "destructive", title: "Error", description: "No site data available." });
           // router.push('/');
           notFound();
        }
      } catch (error) {
        console.error("Failed to load site from localStorage", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load site data." });
        // router.push('/');
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
  }, [siteId, router, toast]);

  const handleShare = async () => {
    if (navigator.share && siteData) {
      try {
        await navigator.share({
          title: siteData.title,
          text: `Check out this AI-generated website: ${siteData.title}`,
          url: window.location.href,
        });
        toast({ title: "Shared successfully!" });
      } catch (error) {
        toast({ variant: "destructive", title: "Share failed", description: "Could not share the site."});
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied!", description: "Site URL copied to clipboard." });
      } catch (err) {
        toast({ variant: "destructive", title: "Copy failed", description: "Could not copy URL."});
      }
    }
  };

  const handleDownload = () => {
    if (siteData && siteData.htmlContent) {
      const blob = new Blob([siteData.htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${siteData.title.replace(/[^a-zA-Z0-9]/g, '_') || 'generated_site'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Download Started", description: `Downloading ${a.download}` });
    } else {
      toast({ variant: "destructive", title: "Download Failed", description: "No HTML content to download." });
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl font-headline text-muted-foreground">Loading Site Preview...</p>
        </div>
      </div>
    );
  }

  if (!siteData) {
    // This case should ideally be handled by notFound() earlier, but as a fallback:
    return <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-destructive">Site Not Found</h1>
        <p className="text-muted-foreground">The requested site could not be loaded.</p>
         <Button onClick={() => router.push('/')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
        </Button>
      </div>;
  }
  
  // Note: For full SEO on this page if it were public, meta tags would need to be set server-side.
  // Since this is a client-rendered preview of locally-stored data, we can use <Head> from next/head for title.
  // For meta description, it's part of the iframe's srcDoc.
  return (
    <>
      <Head>
        <title>{siteData.title} - WebForge AI Preview</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card rounded-lg shadow">
          <div>
            <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-2 sm:mb-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>
            <h1 className="text-3xl font-headline text-primary">{siteData.title}</h1>
            <p className="text-sm text-muted-foreground">Topic: {siteData.topic} | Style: {siteData.style}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button onClick={handleDownload} variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download HTML
            </Button>
          </div>
        </div>
        <RenderedHtml htmlContent={siteData.htmlContent} title={siteData.title} />
      </div>
    </>
  );
}
