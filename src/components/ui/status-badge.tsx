import { cn } from '@/lib/utils';
import { ScanStatus } from '@/types/scan';
import { Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ScanStatus;
  className?: string;
}

const statusConfig: Record<ScanStatus, { label: string; className: string; isAnimated?: boolean }> = {
  queued: {
    label: 'Queued',
    className: 'bg-muted/50 text-muted-foreground border-muted-foreground/30',
  },
  parsing: {
    label: 'Parsing',
    className: 'bg-primary/20 text-primary border-primary/30',
    isAnimated: true,
  },
  decompiling: {
    label: 'Decompiling',
    className: 'bg-accent/20 text-accent border-accent/30',
    isAnimated: true,
  },
  analyzing: {
    label: 'Analyzing',
    className: 'bg-warning/20 text-warning border-warning/30',
    isAnimated: true,
  },
  enriching: {
    label: 'Enriching',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    isAnimated: true,
  },
  complete: {
    label: 'Complete',
    className: 'bg-success/20 text-success border-success/30',
  },
  failed: {
    label: 'Failed',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
      config.className,
      className
    )}>
      {config.isAnimated && (
        <Loader2 className="w-3 h-3 animate-spin" />
      )}
      {config.label}
    </span>
  );
}
