import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ECUType, Architecture, ScanMetadata } from '@/types/scan';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MetadataFormProps {
  form: UseFormReturn<ScanMetadata>;
}

const ecuTypes: ECUType[] = ['Engine', 'Transmission', 'BCM', 'TCU', 'ADAS', 'Infotainment', 'Gateway', 'Other'];
const architectures: Architecture[] = ['ARM', 'PowerPC', 'TriCore', 'x86', 'Unknown'];
const priorities = ['low', 'medium', 'high', 'critical'] as const;
const complianceFrameworks = [
  { id: 'misra-c', label: 'MISRA C:2012' },
  { id: 'iso-21434', label: 'ISO 21434' },
  { id: 'iso-26262', label: 'ISO 26262' },
  { id: 'autosar', label: 'AUTOSAR' },
];

export function MetadataForm({ form }: MetadataFormProps) {
  const { register, setValue, watch } = form;
  const selectedFrameworks = watch('complianceFrameworks') || [];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ecuName">ECU Name *</Label>
          <Input
            id="ecuName"
            placeholder="e.g., Engine Control Module v4.2"
            {...register('ecuName', { required: true })}
            className="bg-muted/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ecuType">ECU Type *</Label>
          <Select 
            onValueChange={(value) => setValue('ecuType', value as ECUType)}
            defaultValue={watch('ecuType')}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Select ECU type" />
            </SelectTrigger>
            <SelectContent>
              {ecuTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version / Build Number *</Label>
          <Input
            id="version"
            placeholder="e.g., 4.2.1-release"
            {...register('version', { required: true })}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer *</Label>
          <Input
            id="manufacturer"
            placeholder="e.g., Bosch, Continental, ZF"
            {...register('manufacturer', { required: true })}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Target Vehicle Platform</Label>
          <Input
            id="platform"
            placeholder="e.g., JLR L460, Range Rover 2024"
            {...register('platform')}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Analysis Priority</Label>
          <Select 
            onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high' | 'critical')}
            defaultValue={watch('priority') || 'medium'}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority} className="capitalize">
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Options */}
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced" className="border-border">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              {/* Architecture Selection */}
              <div className="space-y-2">
                <Label htmlFor="architecture">Architecture</Label>
                <Select 
                  onValueChange={(value) => setValue('architecture', value as Architecture)}
                  defaultValue={watch('architecture') || 'Unknown'}
                >
                  <SelectTrigger className="bg-muted/50 w-full md:w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {architectures.map((arch) => (
                      <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Auto-detected if not specified
                </p>
              </div>

              {/* Deep Analysis Toggle */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="deepAnalysis"
                  checked={watch('enableDeepAnalysis')}
                  onCheckedChange={(checked) => setValue('enableDeepAnalysis', !!checked)}
                />
                <div>
                  <Label htmlFor="deepAnalysis" className="cursor-pointer">
                    Enable Deep Analysis
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Performs additional symbolic execution and taint analysis (takes longer)
                  </p>
                </div>
              </div>

              {/* Compliance Frameworks */}
              <div className="space-y-3">
                <Label>Compliance Frameworks</Label>
                <div className="grid grid-cols-2 gap-3">
                  {complianceFrameworks.map((framework) => (
                    <div key={framework.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={framework.id}
                        checked={selectedFrameworks.includes(framework.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue('complianceFrameworks', [...selectedFrameworks, framework.id]);
                          } else {
                            setValue('complianceFrameworks', selectedFrameworks.filter((f: string) => f !== framework.id));
                          }
                        }}
                      />
                      <Label htmlFor={framework.id} className="cursor-pointer text-sm">
                        {framework.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
