import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Shield, Code, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Vulnerability } from '@/hooks/useScans';

interface CodeViewerProps {
  vulnerabilities: Vulnerability[];
  fileName?: string;
}

interface VulnerabilityLine {
  lineNumber: number;
  vulnerability: Vulnerability;
}

export function CodeViewer({ vulnerabilities, fileName }: CodeViewerProps) {
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);

  // Group vulnerabilities by component/file
  const vulnsByFile = vulnerabilities.reduce((acc, vuln) => {
    const file = vuln.affected_component || 'Unknown';
    if (!acc[file]) acc[file] = [];
    acc[file].push(vuln);
    return acc;
  }, {} as Record<string, Vulnerability[]>);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 border-destructive text-destructive';
      case 'high': return 'bg-warning/20 border-warning text-warning';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'low': return 'bg-success/20 border-success text-success';
      default: return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10';
      case 'high': return 'bg-warning/10';
      case 'medium': return 'bg-yellow-500/10';
      case 'low': return 'bg-success/10';
      default: return 'bg-muted/30';
    }
  };

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-3">
        <FileCode className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Security Analysis</h3>
          <p className="text-sm text-muted-foreground">Vulnerabilities mapped to source locations</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {Object.entries(vulnsByFile).map(([file, fileVulns]) => (
          <div key={file} className="p-4">
            {/* File Header */}
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground">{file}</span>
              <Badge variant="outline" className="ml-2">
                {fileVulns.length} issue{fileVulns.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Vulnerabilities in this file */}
            <div className="space-y-3">
              {fileVulns.map((vuln) => (
                <Collapsible
                  key={vuln.id}
                  open={expandedVuln === vuln.id}
                  onOpenChange={(open) => setExpandedVuln(open ? vuln.id : null)}
                >
                  <CollapsibleTrigger asChild>
                    <div 
                      className={cn(
                        "rounded-lg border cursor-pointer transition-all hover:shadow-md",
                        getSeverityColor(vuln.severity)
                      )}
                    >
                      <div className="p-3 flex items-start gap-3">
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 mt-0.5">
                          {expandedVuln === vuln.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{vuln.title}</span>
                            {vuln.line_number && (
                              <span className="text-xs font-mono opacity-70">
                                Line {vuln.line_number}
                              </span>
                            )}
                            {vuln.cwe_id && (
                              <Badge variant="outline" className="text-xs">
                                {vuln.cwe_id}
                              </Badge>
                            )}
                          </div>
                          {vuln.affected_function && (
                            <p className="text-xs font-mono mt-1 opacity-70">
                              {vuln.affected_function}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-lg font-bold font-mono">
                            {vuln.cvss_score?.toFixed(1) || 'N/A'}
                          </span>
                          <div className="text-xs opacity-70">CVSS</div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className={cn("mt-2 rounded-lg p-4 space-y-4", getSeverityBg(vuln.severity))}>
                      {/* Description */}
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Description
                        </h5>
                        <p className="text-sm text-foreground">{vuln.description}</p>
                      </div>

                      {/* Code Snippet with Line Highlight */}
                      {vuln.code_snippet && (
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Vulnerable Code
                          </h5>
                          <div className="rounded-lg overflow-hidden border border-border bg-background">
                            <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                              <Code className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs font-mono text-muted-foreground">
                                {vuln.affected_component}
                                {vuln.line_number && `:${vuln.line_number}`}
                              </span>
                            </div>
                            <pre className="p-4 text-sm font-mono overflow-x-auto">
                              <code className="text-foreground">{vuln.code_snippet}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Attack Vector */}
                      {vuln.attack_vector && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                          <h5 className="text-xs font-medium text-destructive uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Attack Vector
                          </h5>
                          <p className="text-sm text-foreground">{vuln.attack_vector}</p>
                        </div>
                      )}

                      {/* Impact */}
                      {vuln.impact && (
                        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                          <h5 className="text-xs font-medium text-warning uppercase tracking-wide mb-2">
                            Impact
                          </h5>
                          <p className="text-sm text-foreground">{vuln.impact}</p>
                        </div>
                      )}

                      {/* Remediation */}
                      {vuln.remediation && (
                        <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                          <h5 className="text-xs font-medium text-success uppercase tracking-wide mb-2">
                            Remediation
                          </h5>
                          <p className="text-sm text-foreground">{vuln.remediation}</p>
                        </div>
                      )}

                      {/* LLM Enrichment - Detailed Analysis */}
                      {vuln.llm_enrichment && typeof vuln.llm_enrichment === 'object' && (
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                          <h5 className="text-xs font-medium text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            AI Security Analysis
                          </h5>
                          
                          {(vuln.llm_enrichment as any).detailed_explanation && (
                            <div className="mb-3">
                              <p className="text-sm text-foreground">
                                {(vuln.llm_enrichment as any).detailed_explanation}
                              </p>
                            </div>
                          )}

                          {(vuln.llm_enrichment as any).attack_scenarios && (
                            <div className="mb-3">
                              <h6 className="text-xs font-medium text-primary mb-2">Attack Scenarios:</h6>
                              <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                                {((vuln.llm_enrichment as any).attack_scenarios as string[]).slice(0, 3).map((scenario, i) => (
                                  <li key={i} className="text-muted-foreground">{scenario}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(vuln.llm_enrichment as any).step_by_step_remediation && (
                            <div className="mb-3">
                              <h6 className="text-xs font-medium text-primary mb-2">Fix Steps:</h6>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                {((vuln.llm_enrichment as any).step_by_step_remediation as string[]).map((step, i) => (
                                  <li key={i} className="text-muted-foreground">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {(vuln.llm_enrichment as any).code_fix_example && (
                            <div>
                              <h6 className="text-xs font-medium text-primary mb-2">Fixed Code Example:</h6>
                              <pre className="p-3 rounded bg-background border border-border text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                {(vuln.llm_enrichment as any).code_fix_example}
                              </pre>
                            </div>
                          )}

                          {(vuln.llm_enrichment as any).iso_considerations && (
                            <div className="mt-3 p-2 rounded bg-primary/5 border border-primary/20">
                              <h6 className="text-xs font-medium text-primary mb-1">ISO 26262/21434 Considerations:</h6>
                              <p className="text-xs text-muted-foreground">
                                {(vuln.llm_enrichment as any).iso_considerations}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}

        {vulnerabilities.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No vulnerabilities found in this scan.
          </div>
        )}
      </div>
    </div>
  );
}
