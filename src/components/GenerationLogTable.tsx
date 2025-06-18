import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { GenerationLog } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type GenerationLogTableProps = {
  logs: GenerationLog[];
};

export function GenerationLogTable({ logs }: GenerationLogTableProps) {
  if (logs.length === 0) {
    return (
       <div className="text-center py-6">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-lg text-muted-foreground font-headline">No generation logs available.</p>
        <p className="text-xs text-muted-foreground">Activity will be logged here once you generate websites.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-md overflow-hidden bg-card">
      <Table>
        <TableCaption className="py-4 text-sm">A log of recent website generation attempts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Style</TableHead>
            <TableHead className="text-center">Sections</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="flex items-center gap-1 w-fit">
                  {log.status === 'success' ? 
                    <CheckCircle2 className="h-3.5 w-3.5" /> : 
                    <XCircle className="h-3.5 w-3.5" />
                  }
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{log.topic}</TableCell>
              <TableCell>{log.style}</TableCell>
              <TableCell className="text-center">{log.sectionsCount}</TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
