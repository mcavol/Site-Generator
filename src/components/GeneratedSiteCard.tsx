import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Tag, MessageSquare } from 'lucide-react';
import type { GeneratedSite } from '@/types';

type GeneratedSiteCardProps = {
  site: GeneratedSite;
};

export function GeneratedSiteCard({ site }: GeneratedSiteCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary truncate" title={site.title}>
          {site.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4 mr-1.5" /> Topic: {site.topic}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm">
          <Tag className="w-4 h-4 mr-1.5 text-accent" />
          Style: <span className="font-medium ml-1">{site.style}</span>
        </div>
        <div className="flex items-center text-sm">
          <FileText className="w-4 h-4 mr-1.5 text-accent" />
          Sections: <span className="font-medium ml-1">{site.contentSections.length}</span>
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          Generated on: {new Date(site.timestamp).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/site/${site.id}`}>
            View Site
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
