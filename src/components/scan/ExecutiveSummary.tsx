import { FileText, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Scan } from '@/types/scan';

interface ExecutiveSummaryProps {
  scan: Scan;
}

export function ExecutiveSummary({ scan }: ExecutiveSummaryProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-yellow-400';
    return 'text-success';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'Critical Risk';
    if (score >= 60) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="glass-card rounded-xl border border-border p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Executive Summary</h3>
          <p className="text-sm text-muted-foreground">AI-generated security assessment</p>
        </div>
      </div>

      {/* Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Risk Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono ${getRiskColor(scan.riskScore || 0)}`}>
              {scan.riskScore || 0}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <span className={`text-sm font-medium ${getRiskColor(scan.riskScore || 0)}`}>
            {getRiskLabel(scan.riskScore || 0)}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Compliance Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-foreground">
              {scan.complianceScore || 0}%
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ISO 21434 / MISRA C
          </span>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Issues</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-foreground">
              {scan.vulnerabilities.critical + scan.vulnerabilities.high + scan.vulnerabilities.medium + scan.vulnerabilities.low}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-destructive">{scan.vulnerabilities.critical} critical</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-warning">{scan.vulnerabilities.high} high</span>
          </div>
        </div>
      </div>

      {/* Summary Text */}
      {scan.executiveSummary && (
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {scan.executiveSummary}
          </p>
        </div>
      )}

      {/* Key Findings */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Key Findings</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
            Buffer overflow in CAN message handler requires immediate patching
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
            Hardcoded cryptographic keys detected in secure boot module
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
            Missing UDS seed-key authentication for diagnostic services
          </li>
        </ul>
      </div>

      {/* Recommended Actions */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h4 className="text-sm font-medium text-primary mb-3">Recommended Actions</h4>
        <ol className="space-y-2 list-decimal list-inside">
          <li className="text-sm text-muted-foreground">
            Replace hardcoded keys with HSM-stored keys and implement secure key management
          </li>
          <li className="text-sm text-muted-foreground">
            Add bounds checking to all CAN message handlers
          </li>
          <li className="text-sm text-muted-foreground">
            Implement ISO 14229 compliant seed-key authentication
          </li>
        </ol>
      </div>
    </div>
  );
}
