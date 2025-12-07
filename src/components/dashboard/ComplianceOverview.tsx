import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const complianceData = [
  { name: 'Passing', value: 156, color: 'hsl(142, 71%, 45%)' },
  { name: 'Failing', value: 42, color: 'hsl(0, 84%, 60%)' },
  { name: 'Warnings', value: 28, color: 'hsl(38, 92%, 50%)' },
];

const frameworkStatus = [
  { name: 'MISRA C:2012', passed: 45, failed: 12, warnings: 8 },
  { name: 'ISO 21434', passed: 38, failed: 15, warnings: 7 },
  { name: 'AUTOSAR', passed: 52, failed: 8, warnings: 10 },
  { name: 'ISO 26262', passed: 21, failed: 7, warnings: 3 },
];

export function ComplianceOverview() {
  return (
    <div className="glass-card rounded-xl border border-border p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
        <p className="text-sm text-muted-foreground">Framework adherence overview</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 8%)', 
                  border: '1px solid hsl(222, 47%, 18%)',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Framework List */}
        <div className="space-y-2">
          {frameworkStatus.map((framework, index) => (
            <div 
              key={framework.name}
              className="p-2 rounded-lg bg-muted/30 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-xs font-medium text-foreground mb-1">{framework.name}</div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  {framework.passed}
                </div>
                <div className="flex items-center gap-1 text-destructive">
                  <XCircle className="w-3 h-3" />
                  {framework.failed}
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <AlertCircle className="w-3 h-3" />
                  {framework.warnings}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
