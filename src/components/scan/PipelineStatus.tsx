import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { ScanStatus } from '@/types/scan';
import { cn } from '@/lib/utils';

interface PipelineStatusProps {
  currentStatus: ScanStatus;
  progress: number;
}

const stages: { status: ScanStatus; label: string }[] = [
  { status: 'parsing', label: 'Parse Binary' },
  { status: 'decompiling', label: 'Decompile' },
  { status: 'analyzing', label: 'Analyze' },
  { status: 'enriching', label: 'AI Enrichment' },
  { status: 'complete', label: 'Complete' },
];

const stageOrder: Record<ScanStatus, number> = {
  queued: -1,
  parsing: 0,
  decompiling: 1,
  analyzing: 2,
  enriching: 3,
  complete: 4,
  failed: -2,
};

export function PipelineStatus({ currentStatus, progress }: PipelineStatusProps) {
  const currentStageIndex = stageOrder[currentStatus];
  const isFailed = currentStatus === 'failed';

  return (
    <div className="glass-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Analysis Pipeline</h3>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
        <div 
          className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ 
            width: currentStatus === 'complete' 
              ? 'calc(100% - 40px)' 
              : `calc(${(currentStageIndex / (stages.length - 1)) * 100}% - 20px)` 
          }}
        />
        
        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = currentStageIndex > index;
            const isCurrent = currentStageIndex === index && !isFailed;
            const isUpcoming = currentStageIndex < index;
            
            return (
              <div key={stage.status} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary/20 border-primary animate-pulse-glow",
                  isUpcoming && "bg-background border-border",
                  isFailed && index === currentStageIndex && "bg-destructive/20 border-destructive"
                )}>
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  )}
                  {isCurrent && !isFailed && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {isFailed && index === currentStageIndex && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  {isUpcoming && (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  "mt-2 text-xs font-medium",
                  isCompleted && "text-primary",
                  isCurrent && "text-foreground",
                  isUpcoming && "text-muted-foreground"
                )}>
                  {stage.label}
                </span>
                {isCurrent && (
                  <span className="text-xs text-muted-foreground font-mono mt-1">
                    {progress}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
