import type { GeneratedSite } from '@/types';
import { GeneratedSiteCard } from './GeneratedSiteCard';
import { Info } from 'lucide-react';

type GeneratedSiteListProps = {
  sites: GeneratedSite[];
};

export function GeneratedSiteList({ sites }: GeneratedSiteListProps) {
  if (sites.length === 0) {
    return (
      <div className="text-center py-10">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground font-headline">No websites generated yet.</p>
        <p className="text-sm text-muted-foreground">Use the form above to create your first AI-powered website.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <GeneratedSiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
