import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, Cpu, Calendar, Hash, HardDrive, Microchip } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { PipelineStatus } from '@/components/scan/PipelineStatus';
import { ExecutiveSummary } from '@/components/scan/ExecutiveSummary';
import { VulnerabilityList } from '@/components/scan/VulnerabilityList';
import { mockScans, mockVulnerabilities } from '@/data/mockData';
import { format } from 'date-fns';

export default function ScanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scan = mockScans.find((s) => s.id === id);
  const vulnerabilities = mockVulnerabilities.filter((v) => v.scanId === id);

  if (!scan) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold text-foreground mb-2">Scan not found</h2>
          <p className="text-muted-foreground mb-4">The requested scan could not be found.</p>
          <Button onClick={() => navigate('/scans')}>View All Scans</Button>
        </div>
      </AppLayout>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/scans')}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scans
            </Button>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{scan.ecuName}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{scan.ecuType}</span>
                  <span>•</span>
                  <span>{scan.manufacturer}</span>
                  <span>•</span>
                  <span className="font-mono">{scan.version}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={scan.status} />
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-scan
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Binary Metadata */}
        <div className="glass-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Binary Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Hash className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">SHA-256</div>
                <div className="text-sm font-mono text-foreground truncate max-w-[120px]" title={scan.fileHash}>
                  {scan.fileHash.substring(0, 12)}...
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">File Size</div>
                <div className="text-sm font-mono text-foreground">{formatFileSize(scan.fileSize)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Microchip className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Architecture</div>
                <div className="text-sm font-mono text-foreground">{scan.architecture}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Scanned</div>
                <div className="text-sm text-foreground">{format(scan.createdAt, 'MMM d, yyyy HH:mm')}</div>
              </div>
            </div>
            {scan.completedAt && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div className="text-sm text-foreground">{format(scan.completedAt, 'MMM d, yyyy HH:mm')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Status */}
        <PipelineStatus currentStatus={scan.status} progress={scan.progress} />

        {/* Executive Summary (only show if complete) */}
        {scan.status === 'complete' && <ExecutiveSummary scan={scan} />}

        {/* Vulnerabilities */}
        {scan.status === 'complete' && vulnerabilities.length > 0 && (
          <VulnerabilityList vulnerabilities={vulnerabilities} />
        )}

        {/* Show message if scan is in progress */}
        {scan.status !== 'complete' && scan.status !== 'failed' && (
          <div className="glass-card rounded-xl border border-border p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Analysis in Progress</h3>
              <p className="text-muted-foreground">
                Please wait while we analyze your ECU binary. Results will appear here automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
