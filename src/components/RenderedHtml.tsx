'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type RenderedHtmlProps = {
  htmlContent: string | null;
  title?: string;
};

export function RenderedHtml({ htmlContent, title = "Site Preview" }: RenderedHtmlProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (htmlContent) {
      // Simulate loading time for iframe content or if content was fetched
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true); // Keep loading if no content
    }
  }, [htmlContent]);

  if (isLoading) {
    return (
      <Card className="w-full h-[calc(100vh-200px)] shadow-lg">
        <CardContent className="p-4 h-full">
          <Skeleton className="w-full h-full rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  if (!htmlContent) {
    return (
      <Card className="w-full h-[calc(100vh-200px)] flex items-center justify-center shadow-lg">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground font-headline text-xl">No content to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-auto shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <iframe
          srcDoc={htmlContent}
          title={title}
          sandbox="allow-scripts allow-same-origin" // Adjust sandbox rules as needed. Be cautious with allow-scripts.
          style={{
            width: '100%',
            height: 'calc(100vh - 160px)', // Adjust height based on surrounding layout
            border: 'none',
            display: 'block', // Ensures no extra space below iframe
          }}
          onLoad={() => setIsLoading(false)} // Double check loading state
        />
      </CardContent>
    </Card>
  );
}
