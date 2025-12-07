import { FileSearch } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useScans } from '@/hooks/useScans';

interface ScanSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ScanSelector({ value, onChange, className }: ScanSelectorProps) {
  const { data: scans = [], isLoading } = useScans();
  
  // Only show completed scans
  const completedScans = scans.filter(s => s.status === 'complete');

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className={className}>
        <FileSearch className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select scan..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Scans</SelectItem>
        {completedScans.map((scan) => (
          <SelectItem key={scan.id} value={scan.id}>
            {scan.ecu_name} - {scan.file_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
