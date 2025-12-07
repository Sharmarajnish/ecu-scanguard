import { FileSearch, Activity, Shield, Target } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { mockScans } from '@/data/mockData';

export function StatsOverview() {
  const totalScans = mockScans.length;
  const activeScans = mockScans.filter(s => !['complete', 'failed', 'queued'].includes(s.status)).length;
  const totalCritical = mockScans.reduce((acc, s) => acc + s.vulnerabilities.critical, 0);
  const avgCompliance = mockScans
    .filter(s => s.complianceScore !== undefined)
    .reduce((acc, s, _, arr) => acc + (s.complianceScore || 0) / arr.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total ECUs Scanned"
        value={totalScans}
        subtitle="Across all platforms"
        icon={FileSearch}
        trend={{ value: 12, isPositive: true }}
        variant="primary"
      />
      <StatCard
        title="Active Scans"
        value={activeScans}
        subtitle="Currently processing"
        icon={Activity}
        variant="default"
      />
      <StatCard
        title="Critical Vulnerabilities"
        value={totalCritical}
        subtitle="Requires immediate action"
        icon={Shield}
        trend={{ value: 8, isPositive: false }}
        variant="destructive"
      />
      <StatCard
        title="Avg. Compliance Score"
        value={`${Math.round(avgCompliance)}%`}
        subtitle="ISO 21434 / MISRA C"
        icon={Target}
        trend={{ value: 5, isPositive: true }}
        variant="success"
      />
    </div>
  );
}
