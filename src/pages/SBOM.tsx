import { Database, Package, AlertTriangle, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { SeverityBadge } from '@/components/ui/severity-badge';

const mockSBOMData = [
  {
    id: '1',
    componentName: 'OpenSSL',
    version: '1.1.1k',
    license: 'OpenSSL License',
    vulnerabilities: ['CVE-2021-3449', 'CVE-2021-3450'],
    risk: 'high' as const,
  },
  {
    id: '2',
    componentName: 'FreeRTOS',
    version: '10.4.3',
    license: 'MIT',
    vulnerabilities: [],
    risk: 'low' as const,
  },
  {
    id: '3',
    componentName: 'lwIP',
    version: '2.1.2',
    license: 'BSD-3-Clause',
    vulnerabilities: ['CVE-2020-8597'],
    risk: 'medium' as const,
  },
  {
    id: '4',
    componentName: 'Mbed TLS',
    version: '2.25.0',
    license: 'Apache 2.0',
    vulnerabilities: [],
    risk: 'low' as const,
  },
  {
    id: '5',
    componentName: 'zlib',
    version: '1.2.11',
    license: 'zlib License',
    vulnerabilities: ['CVE-2022-37434'],
    risk: 'critical' as const,
  },
];

export default function SBOM() {
  const totalComponents = mockSBOMData.length;
  const componentsWithVulns = mockSBOMData.filter((c) => c.vulnerabilities.length > 0).length;
  const totalVulnerabilities = mockSBOMData.reduce((acc, c) => acc + c.vulnerabilities.length, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Software Bill of Materials</h1>
            <p className="text-muted-foreground">
              Third-party components and dependencies detected in ECU firmware
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground font-mono">{totalComponents}</div>
                <div className="text-sm text-muted-foreground">Total Components</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning font-mono">{componentsWithVulns}</div>
                <div className="text-sm text-muted-foreground">Vulnerable Components</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive font-mono">{totalVulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Known Vulnerabilities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Components Table */}
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Detected Components</h3>
            <p className="text-sm text-muted-foreground">Libraries and dependencies identified in firmware</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Component</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Version</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">License</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vulnerabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockSBOMData.map((component, index) => (
                  <tr 
                    key={component.id}
                    className="hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{component.componentName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-muted-foreground">{component.version}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">{component.license}</Badge>
                    </td>
                    <td className="p-4">
                      <SeverityBadge severity={component.risk} />
                    </td>
                    <td className="p-4">
                      {component.vulnerabilities.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {component.vulnerabilities.map((cve) => (
                            <span key={cve} className="text-xs font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                              {cve}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-success">No known vulnerabilities</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
