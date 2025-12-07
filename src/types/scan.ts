export type ScanStatus = 
  | 'queued' 
  | 'parsing' 
  | 'decompiling' 
  | 'analyzing' 
  | 'enriching' 
  | 'complete' 
  | 'failed';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type VulnerabilityStatus = 
  | 'new' 
  | 'reopened' 
  | 'fixed' 
  | 'false_positive' 
  | 'risk_accepted';

export type ECUType = 
  | 'Engine' 
  | 'Transmission' 
  | 'BCM' 
  | 'TCU' 
  | 'ADAS' 
  | 'Infotainment' 
  | 'Gateway' 
  | 'Other';

export type Architecture = 'ARM' | 'PowerPC' | 'TriCore' | 'x86' | 'Unknown';

export interface Scan {
  id: string;
  ecuName: string;
  ecuType: ECUType;
  version: string;
  manufacturer: string;
  fileHash: string;
  fileSize: number;
  architecture: Architecture;
  status: ScanStatus;
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  complianceScore?: number;
  riskScore?: number;
  executiveSummary?: string;
}

export interface Vulnerability {
  id: string;
  scanId: string;
  cveId?: string;
  cweId: string;
  severity: Severity;
  cvssScore: number;
  title: string;
  description: string;
  affectedComponent: string;
  affectedFunction?: string;
  codeSnippet?: string;
  lineNumber?: number;
  detectionMethod: string;
  status: VulnerabilityStatus;
  remediation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceResult {
  id: string;
  scanId: string;
  framework: string;
  ruleId: string;
  ruleDescription: string;
  status: 'pass' | 'fail' | 'warning';
  details?: string;
}

export interface SBOMComponent {
  id: string;
  scanId: string;
  componentName: string;
  version: string;
  license: string;
  vulnerabilities: string[];
}

export interface AnalysisLog {
  id: string;
  scanId: string;
  stage: ScanStatus;
  logLevel: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface ScanMetadata {
  ecuName: string;
  ecuType: ECUType;
  version: string;
  manufacturer: string;
  platform?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  architecture: Architecture;
  enableDeepAnalysis?: boolean;
  complianceFrameworks: string[];
}
