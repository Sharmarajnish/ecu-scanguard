import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Download, Trash2, Cpu } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockScans } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Scans() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredScans = mockScans.filter((scan) => {
    const matchesSearch = scan.ecuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scan.status === statusFilter;
    const matchesType = typeFilter === 'all' || scan.ecuType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Scans</h1>
            <p className="text-muted-foreground">
              View and manage all ECU security scans
            </p>
          </div>
          <Button onClick={() => navigate('/upload')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Scan
          </Button>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search ECUs, manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="parsing">Parsing</SelectItem>
                  <SelectItem value="decompiling">Decompiling</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="enriching">Enriching</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="ECU Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="BCM">BCM</SelectItem>
                  <SelectItem value="TCU">TCU</SelectItem>
                  <SelectItem value="ADAS">ADAS</SelectItem>
                  <SelectItem value="Infotainment">Infotainment</SelectItem>
                  <SelectItem value="Gateway">Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scans Table */}
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ECU</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vulnerabilities</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredScans.map((scan, index) => (
                  <tr 
                    key={scan.id}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer transition-colors animate-fade-in",
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => navigate(`/scans/${scan.id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                          <Cpu className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{scan.ecuName}</div>
                          <div className="text-xs text-muted-foreground">
                            {scan.manufacturer} • <span className="font-mono">{scan.version}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{scan.ecuType}</span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <StatusBadge status={scan.status} />
                        {!['complete', 'failed', 'queued'].includes(scan.status) && (
                          <ProgressBar value={scan.progress} size="sm" className="w-24" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {scan.status === 'complete' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-destructive">{scan.vulnerabilities.critical}</span>
                            <SeverityBadge severity="critical" showLabel={false} size="sm" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-warning">{scan.vulnerabilities.high}</span>
                            <SeverityBadge severity="high" showLabel={false} size="sm" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-yellow-400">{scan.vulnerabilities.medium}</span>
                            <SeverityBadge severity="medium" showLabel={false} size="sm" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-success">{scan.vulnerabilities.low}</span>
                            <SeverityBadge severity="low" showLabel={false} size="sm" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {format(scan.createdAt, 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/scans/${scan.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredScans.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No scans found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
