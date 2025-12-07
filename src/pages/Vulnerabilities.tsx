import { useState } from 'react';
import { Search, Filter, ExternalLink, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockVulnerabilities, mockScans } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Vulnerability, VulnerabilityStatus } from '@/types/scan';

const statusColors: Record<VulnerabilityStatus, string> = {
  new: 'bg-primary/20 text-primary border-primary/30',
  reopened: 'bg-warning/20 text-warning border-warning/30',
  fixed: 'bg-success/20 text-success border-success/30',
  false_positive: 'bg-muted text-muted-foreground border-muted-foreground/30',
  risk_accepted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVulns = mockVulnerabilities.filter((vuln) => {
    const matchesSearch = 
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.cveId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.cweId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || vuln.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getEcuName = (scanId: string) => {
    const scan = mockScans.find((s) => s.id === scanId);
    return scan?.ecuName || 'Unknown ECU';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-destructive/20 to-warning/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vulnerability Database</h1>
            <p className="text-muted-foreground">
              All detected security vulnerabilities across ECU scans
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="text-2xl font-bold text-destructive font-mono">
              {mockVulnerabilities.filter((v) => v.severity === 'critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="glass-card rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="text-2xl font-bold text-warning font-mono">
              {mockVulnerabilities.filter((v) => v.severity === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">High</div>
          </div>
          <div className="glass-card rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {mockVulnerabilities.filter((v) => v.severity === 'medium').length}
            </div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </div>
          <div className="glass-card rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="text-2xl font-bold text-success font-mono">
              {mockVulnerabilities.filter((v) => v.severity === 'low').length}
            </div>
            <div className="text-sm text-muted-foreground">Low</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search CVE, CWE, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <div className="flex gap-3">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reopened">Reopened</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                  <SelectItem value="risk_accepted">Risk Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Vulnerabilities Table */}
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">CVE / CWE</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Affected ECU</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">CVSS</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Detected</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVulns.map((vuln, index) => (
                  <tr 
                    key={vuln.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors animate-fade-in",
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <SeverityBadge severity={vuln.severity} />
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {vuln.cveId && (
                          <span className="block text-sm font-mono text-primary">{vuln.cveId}</span>
                        )}
                        <span className="block text-xs font-mono text-muted-foreground">{vuln.cweId}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-medium text-foreground truncate">{vuln.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{vuln.affectedComponent}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{getEcuName(vuln.scanId)}</span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", statusColors[vuln.status])}
                      >
                        {vuln.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold font-mono text-foreground">{vuln.cvssScore.toFixed(1)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {format(vuln.createdAt, 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {vuln.cveId && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVulns.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No vulnerabilities found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
