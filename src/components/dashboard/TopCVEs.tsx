import { ExternalLink, AlertTriangle } from 'lucide-react';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { Button } from '@/components/ui/button';
import { Severity } from '@/types/scan';

interface CVEItem {
  id: string;
  name: string;
  severity: Severity;
  affectedEcus: number;
  cvssScore: number;
}

const topCVEs: CVEItem[] = [
  { id: 'CVE-2024-1234', name: 'Buffer Overflow in CAN Handler', severity: 'critical', affectedEcus: 4, cvssScore: 9.8 },
  { id: 'CVE-2024-1235', name: 'Hardcoded Crypto Key', severity: 'critical', affectedEcus: 3, cvssScore: 9.1 },
  { id: 'CVE-2023-9876', name: 'Missing Authentication', severity: 'high', affectedEcus: 5, cvssScore: 8.1 },
  { id: 'CVE-2023-5432', name: 'Weak PRNG Usage', severity: 'high', affectedEcus: 6, cvssScore: 7.5 },
  { id: 'CVE-2024-2468', name: 'Input Validation Bypass', severity: 'medium', affectedEcus: 2, cvssScore: 6.5 },
];

export function TopCVEs() {
  return (
    <div className="glass-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top CVEs</h3>
          <p className="text-sm text-muted-foreground">Most common vulnerabilities</p>
        </div>
        <AlertTriangle className="w-5 h-5 text-warning" />
      </div>
      
      <div className="space-y-3">
        {topCVEs.map((cve, index) => (
          <div 
            key={cve.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-medium text-primary">{cve.id}</span>
                <SeverityBadge severity={cve.severity} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground truncate">{cve.name}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-medium text-foreground">{cve.cvssScore}</div>
              <div className="text-xs text-muted-foreground">{cve.affectedEcus} ECUs</div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full mt-4" size="sm">
        View All CVEs
      </Button>
    </div>
  );
}
