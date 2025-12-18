import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// SAST Pattern Matching Rules
// ============================================================================

interface SASTRule {
    id: string;
    cwe_id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    pattern: RegExp;
    languages: string[];
    remediation: string;
}

const SAST_RULES: SASTRule[] = [
    // Buffer Overflow / Memory Safety
    {
        id: 'SAST-001',
        cwe_id: 'CWE-119',
        severity: 'critical',
        title: 'Potential Buffer Overflow',
        description: 'Use of unsafe functions that may lead to buffer overflow',
        pattern: /\b(strcpy|strcat|sprintf|gets|scanf)\s*\(/gi,
        languages: ['c', 'cpp', 'h', 'hpp'],
        remediation: 'Use safer alternatives: strncpy, strncat, snprintf, fgets, or use bounded string functions',
    },
    {
        id: 'SAST-002',
        cwe_id: 'CWE-787',
        severity: 'high',
        title: 'Unsafe Memory Copy',
        description: 'memcpy without bounds checking may cause out-of-bounds write',
        pattern: /memcpy\s*\([^,]+,\s*[^,]+,\s*(?!sizeof)[^)]+\)/gi,
        languages: ['c', 'cpp', 'h', 'hpp'],
        remediation: 'Validate size parameter before memcpy, use sizeof() when possible',
    },
    // Command Injection
    {
        id: 'SAST-003',
        cwe_id: 'CWE-78',
        severity: 'critical',
        title: 'Potential Command Injection',
        description: 'User input passed to system command execution',
        pattern: /\b(system|popen|exec[lv]?p?e?|ShellExecute)\s*\(/gi,
        languages: ['c', 'cpp', 'h', 'hpp', 'py', 'python'],
        remediation: 'Avoid passing user-controlled data to system commands. Use parameterized APIs instead.',
    },
    {
        id: 'SAST-004',
        cwe_id: 'CWE-78',
        severity: 'critical',
        title: 'Shell Command via subprocess',
        description: 'subprocess with shell=True is vulnerable to command injection',
        pattern: /subprocess\.(call|run|Popen)\s*\([^)]*shell\s*=\s*True/gi,
        languages: ['py', 'python'],
        remediation: 'Set shell=False and pass arguments as a list',
    },
    // SQL Injection
    {
        id: 'SAST-005',
        cwe_id: 'CWE-89',
        severity: 'critical',
        title: 'Potential SQL Injection',
        description: 'SQL query constructed with string concatenation',
        pattern: /["']SELECT\s+.*\s+FROM\s+.*["']\s*\+|["']INSERT\s+INTO\s+.*["']\s*\+|["']UPDATE\s+.*SET\s+.*["']\s*\+|["']DELETE\s+FROM\s+.*["']\s*\+/gi,
        languages: ['py', 'python', 'js', 'ts', 'java', 'php'],
        remediation: 'Use parameterized queries or prepared statements',
    },
    // Hardcoded Secrets
    {
        id: 'SAST-006',
        cwe_id: 'CWE-798',
        severity: 'critical',
        title: 'Hardcoded Password',
        description: 'Password appears to be hardcoded in source code',
        pattern: /(?:password|passwd|pwd|secret)\s*[:=]\s*["'][^"']{4,}["']/gi,
        languages: ['*'],
        remediation: 'Use environment variables or a secrets manager',
    },
    {
        id: 'SAST-007',
        cwe_id: 'CWE-798',
        severity: 'critical',
        title: 'Hardcoded API Key',
        description: 'API key or token appears to be hardcoded',
        pattern: /(?:api[_-]?key|api[_-]?secret|auth[_-]?token|access[_-]?token|bearer)\s*[:=]\s*["'][A-Za-z0-9+/=_-]{16,}["']/gi,
        languages: ['*'],
        remediation: 'Store API keys in environment variables or a secrets manager',
    },
    {
        id: 'SAST-008',
        cwe_id: 'CWE-798',
        severity: 'critical',
        title: 'AWS Credentials',
        description: 'AWS access key or secret key found in code',
        pattern: /(?:AKIA[0-9A-Z]{16}|aws[_-]?(?:secret[_-]?)?(?:access[_-]?)?key\s*[:=]\s*["'][A-Za-z0-9+/=]{20,}["'])/gi,
        languages: ['*'],
        remediation: 'Use AWS IAM roles or environment variables for credentials',
    },
    {
        id: 'SAST-009',
        cwe_id: 'CWE-798',
        severity: 'critical',
        title: 'Private Key in Code',
        description: 'Private key material found in source code',
        pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
        languages: ['*'],
        remediation: 'Never commit private keys. Use a secrets manager or secure key storage.',
    },
    // Weak Cryptography
    {
        id: 'SAST-010',
        cwe_id: 'CWE-327',
        severity: 'high',
        title: 'Weak Cryptographic Algorithm',
        description: 'Use of weak or deprecated cryptographic algorithm',
        pattern: /\b(MD5|SHA1|DES|RC4)\s*\(/gi,
        languages: ['*'],
        remediation: 'Use SHA-256 or stronger algorithms. For encryption, use AES-256-GCM.',
    },
    {
        id: 'SAST-011',
        cwe_id: 'CWE-338',
        severity: 'medium',
        title: 'Weak Random Number Generator',
        description: 'Use of non-cryptographic random number generator for security purposes',
        pattern: /\b(rand|srand|random)\s*\(|Math\.random\s*\(/gi,
        languages: ['*'],
        remediation: 'Use cryptographically secure RNG: /dev/urandom, CryptGenRandom, or crypto.getRandomValues',
    },
    // Integer Overflow
    {
        id: 'SAST-012',
        cwe_id: 'CWE-190',
        severity: 'medium',
        title: 'Potential Integer Overflow',
        description: 'Arithmetic operation that may overflow',
        pattern: /malloc\s*\([^)]*\*[^)]*\)|calloc\s*\([^)]*\*[^)]*\)/gi,
        languages: ['c', 'cpp', 'h'],
        remediation: 'Validate sizes before arithmetic operations and check for overflow',
    },
    // Format String
    {
        id: 'SAST-013',
        cwe_id: 'CWE-134',
        severity: 'high',
        title: 'Format String Vulnerability',
        description: 'User-controlled format string can lead to memory disclosure or corruption',
        pattern: /printf\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)|fprintf\s*\([^,]+,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)/gi,
        languages: ['c', 'cpp'],
        remediation: 'Always use a format string literal: printf("%s", user_input)',
    },
    // Path Traversal
    {
        id: 'SAST-014',
        cwe_id: 'CWE-22',
        severity: 'high',
        title: 'Path Traversal',
        description: 'User input used in file path without validation',
        pattern: /(?:open|fopen|readfile|include|require)\s*\([^)]*\.\.\//gi,
        languages: ['*'],
        remediation: 'Validate and sanitize file paths. Use allowlist for allowed directories.',
    },
    // CAN Bus (Automotive specific)
    {
        id: 'SAST-015',
        cwe_id: 'CWE-306',
        severity: 'high',
        title: 'Missing CAN Message Authentication',
        description: 'CAN messages processed without authentication or integrity checks',
        pattern: /CAN_(?:Transmit|Receive|Write|Read|Send)\s*\([^)]*\)|can_(?:send|recv|write|read)\s*\(/gi,
        languages: ['c', 'cpp', 'h'],
        remediation: 'Implement SecOC (Secure Onboard Communication) or MAC-based message authentication',
    },
    // Debug/Test code
    {
        id: 'SAST-016',
        cwe_id: 'CWE-489',
        severity: 'medium',
        title: 'Debug Code in Production',
        description: 'Debug or test code that should be removed in production',
        pattern: /#ifdef\s+DEBUG|#if\s+defined\s*\(\s*DEBUG\s*\)|console\.log\s*\(|print\s*\(.*debug/gi,
        languages: ['*'],
        remediation: 'Remove debug code before production deployment or use conditional compilation',
    },
    // Null Pointer
    {
        id: 'SAST-017',
        cwe_id: 'CWE-476',
        severity: 'medium',
        title: 'Potential Null Pointer Dereference',
        description: 'Pointer dereference without null check',
        pattern: /(?:malloc|calloc|realloc)\s*\([^)]+\)\s*;[^}]*(?:\*|->)/gi,
        languages: ['c', 'cpp', 'h'],
        remediation: 'Always check for NULL after memory allocation before dereferencing',
    },
    // Eval / Code Injection
    {
        id: 'SAST-018',
        cwe_id: 'CWE-94',
        severity: 'critical',
        title: 'Code Injection via eval',
        description: 'Use of eval with potentially untrusted input',
        pattern: /\beval\s*\(/gi,
        languages: ['py', 'python', 'js', 'ts', 'php', 'rb'],
        remediation: 'Avoid eval. Use safe alternatives like JSON.parse or ast.literal_eval',
    },
    // Insecure Deserialization
    {
        id: 'SAST-019',
        cwe_id: 'CWE-502',
        severity: 'high',
        title: 'Insecure Deserialization',
        description: 'Deserializing untrusted data can lead to code execution',
        pattern: /pickle\.load|yaml\.load\s*\([^)]*\)|unserialize\s*\(/gi,
        languages: ['py', 'python', 'php'],
        remediation: 'Use safe loading methods: yaml.safe_load, avoid pickle with untrusted data',
    },
    // XXE
    {
        id: 'SAST-020',
        cwe_id: 'CWE-611',
        severity: 'high',
        title: 'XML External Entity (XXE)',
        description: 'XML parser configured to process external entities',
        pattern: /XMLParser\s*\(|etree\.parse|minidom\.parse|xml\.sax/gi,
        languages: ['py', 'python', 'java'],
        remediation: 'Disable external entity processing in XML parsers',
    },
];

// ============================================================================
// GitHub API Integration
// ============================================================================

interface RepoFile {
    path: string;
    content: string;
    size: number;
}

async function fetchRepositoryContents(
    gitUrl: string,
    branch: string,
    provider: 'github' | 'gitlab',
    accessToken?: string
): Promise<RepoFile[]> {
    const files: RepoFile[] = [];

    // Parse repository URL
    const urlParts = gitUrl.replace(/\.git$/, '').replace(/\/$/, '').split('/');
    const repoName = urlParts[urlParts.length - 1];
    const owner = urlParts[urlParts.length - 2];

    console.log(`Fetching repository: ${owner}/${repoName} branch: ${branch}`);

    // Relevant file extensions for security scanning
    const relevantExtensions = [
        '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx',
        '.py', '.pyw',
        '.js', '.ts', '.jsx', '.tsx',
        '.java', '.kt',
        '.go', '.rs', '.rb', '.php',
        '.xml', '.json', '.yaml', '.yml',
        '.sh', '.bash',
        '.sql',
    ];

    try {
        if (provider === 'github') {
            const headers: Record<string, string> = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'ECU-ScanGuard/1.0',
            };
            if (accessToken) {
                headers['Authorization'] = `token ${accessToken}`;
            }

            console.log(`[realAnalysis] Fetching GitHub repo: ${owner}/${repoName}`);

            // Get repo info
            let repoResponse;
            try {
                repoResponse = await fetch(
                    `https://api.github.com/repos/${owner}/${repoName}`,
                    { headers }
                );
            } catch (fetchError) {
                console.error('[realAnalysis] Network error fetching repo:', fetchError);
                throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to connect to GitHub'}`);
            }

            if (!repoResponse.ok) {
                const errorText = await repoResponse.text();
                console.error('[realAnalysis] GitHub API error:', repoResponse.status, errorText);
                throw new Error(`Failed to access repository: ${repoResponse.status} - ${errorText}`);
            }

            const repoData = await repoResponse.json();
            const defaultBranch = branch || repoData.default_branch || 'main';
            console.log(`[realAnalysis] Using branch: ${defaultBranch}`);

            // Get tree recursively
            console.log('[realAnalysis] Fetching file tree...');
            const treeResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repoName}/git/trees/${defaultBranch}?recursive=1`,
                { headers }
            );

            if (!treeResponse.ok) {
                const errorText = await treeResponse.text();
                console.error('[realAnalysis] GitHub API error fetching tree:', treeResponse.status, errorText);
                throw new Error(`Failed to fetch repository tree: ${treeResponse.status} - ${errorText}`);
            }

            const treeData = await treeResponse.json();

            // Filter relevant files
            const relevantFiles = treeData.tree
                .filter((item: any) => {
                    if (item.type !== 'blob') return false;
                    const fileName = item.path.toLowerCase();
                    return relevantExtensions.some(ext => fileName.endsWith(ext));
                })
                .slice(0, 30); // Limit to prevent timeout

            console.log(`Found ${relevantFiles.length} relevant files`);

            // Fetch content of each file
            for (const file of relevantFiles) {
                try {
                    const contentResponse = await fetch(
                        `https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}?ref=${defaultBranch}`,
                        { headers }
                    );

                    if (contentResponse.ok) {
                        const contentData = await contentResponse.json();
                        if (contentData.encoding === 'base64' && contentData.content) {
                            files.push({
                                path: file.path,
                                content: atob(contentData.content.replace(/\n/g, '')),
                                size: file.size || 0,
                            });
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to fetch ${file.path}:`, e);
                }
            }
        }
        // GitLab implementation similar...
    } catch (error) {
        console.error('Error fetching repository:', error);
        throw error;
    }

    return files;
}

// ============================================================================
// SAST Analysis
// ============================================================================

interface Vulnerability {
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    cwe_id: string;
    cvss_score: number;
    affected_component: string;
    line_number: number | null;
    code_snippet?: string;
    remediation: string;
    detection_method: 'sast' | 'ai' | 'secrets' | 'pii';
}

function runSASTAnalysis(files: RepoFile[]): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    for (const file of files) {
        const ext = file.path.split('.').pop()?.toLowerCase() || '';
        const lines = file.content.split('\n');

        for (const rule of SAST_RULES) {
            // Check if rule applies to this file type
            if (!rule.languages.includes('*') && !rule.languages.includes(ext)) {
                continue;
            }

            // Search for pattern in each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                rule.pattern.lastIndex = 0; // Reset regex state

                if (rule.pattern.test(line)) {
                    // Get surrounding context
                    const startLine = Math.max(0, i - 2);
                    const endLine = Math.min(lines.length - 1, i + 2);
                    const codeSnippet = lines.slice(startLine, endLine + 1).join('\n');

                    // Calculate CVSS based on severity
                    const cvssMap = { critical: 9.0, high: 7.5, medium: 5.0, low: 3.0 };

                    vulnerabilities.push({
                        title: rule.title,
                        description: rule.description,
                        severity: rule.severity,
                        cwe_id: rule.cwe_id,
                        cvss_score: cvssMap[rule.severity],
                        affected_component: file.path,
                        line_number: i + 1,
                        code_snippet: codeSnippet,
                        remediation: rule.remediation,
                        detection_method: 'sast',
                    });
                }
            }
        }
    }

    return vulnerabilities;
}

// ============================================================================
// AI Analysis with Gemini
// ============================================================================

async function runAIAnalysis(
    files: RepoFile[],
    apiKey: string,
    ecuName: string
): Promise<{
    vulnerabilities: Vulnerability[];
    sbomComponents: any[];
    complianceResults: any[];
    executiveSummary: string;
}> {
    // Prepare files summary for AI
    const filesSummary = files.map(f => {
        const content = f.content.slice(0, 3000);
        return `--- ${f.path} ---\n${content}\n`;
    }).join('\n\n').slice(0, 60000);

    const prompt = `You are an expert security analyst. Analyze this source code for security vulnerabilities.

Repository: ${ecuName}

SOURCE FILES:
${filesSummary}

Find security issues INCLUDING:
1. Vulnerabilities not caught by pattern matching (logic flaws, race conditions, etc.)
2. Secret/credential exposure
3. Unsafe API usage
4. Automotive security issues (if applicable)

Return ONLY valid JSON (no markdown):
{
  "vulnerabilities": [
    {
      "title": "string",
      "description": "detailed description",
      "severity": "critical|high|medium|low",
      "cwe_id": "CWE-XXX",
      "cvss_score": 0.0-10.0,
      "affected_component": "file/path.ext",
      "line_number": number or null,
      "code_snippet": "vulnerable code",
      "remediation": "how to fix"
    }
  ],
  "sbom_components": [
    {"component_name": "name", "version": "version", "license": "license"}
  ],
  "compliance_results": [
    {"framework": "name", "rule_id": "id", "rule_description": "desc", "status": "pass|fail|warning", "details": "details"}
  ],
  "executive_summary": "2-3 paragraph security assessment with key findings and recommendations"
}`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 8192,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            throw new Error('No content in Gemini response');
        }

        // Parse JSON from response
        let jsonContent = content;
        if (content.includes('```json')) {
            jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (content.includes('```')) {
            jsonContent = content.replace(/```\n?/g, '');
        }

        const result = JSON.parse(jsonContent.trim());

        // Map AI vulnerabilities with detection_method
        const aiVulns = (result.vulnerabilities || []).map((v: any) => ({
            ...v,
            detection_method: 'ai' as const,
        }));

        return {
            vulnerabilities: aiVulns,
            sbomComponents: result.sbom_components || result.sbomComponents || [],
            complianceResults: result.compliance_results || result.complianceResults || [],
            executiveSummary: result.executive_summary || result.executiveSummary || '',
        };
    } catch (error) {
        console.error('AI analysis error:', error);
        return {
            vulnerabilities: [],
            sbomComponents: [],
            complianceResults: [],
            executiveSummary: 'AI analysis failed. Results are from SAST pattern matching only.',
        };
    }
}

// ============================================================================
// Main Analysis Function
// ============================================================================

async function addLogEntry(scanId: string, stage: string, message: string) {
    await supabase.from('analysis_logs').insert({
        scan_id: scanId,
        stage,
        message,
    });
}

export async function runRealRepositoryAnalysis(
    scanId: string,
    gitUrl: string,
    gitBranch: string,
    gitProvider: 'github' | 'gitlab',
    accessToken: string | undefined,
    geminiApiKey: string,
    metadata: {
        ecuName: string;
        ecuType: string;
        deepAnalysis: boolean;
        complianceFrameworks: string[];
    }
): Promise<void> {
    try {
        // Update status to analyzing
        await supabase
            .from('scans')
            .update({ status: 'analyzing', started_at: new Date().toISOString() })
            .eq('id', scanId);

        await addLogEntry(scanId, 'initialization', `Starting real analysis of ${gitUrl}...`);

        // Stage 1: Fetch repository files
        await addLogEntry(scanId, 'cloning', `Fetching files from ${gitProvider}...`);

        let files: RepoFile[];
        try {
            files = await fetchRepositoryContents(gitUrl, gitBranch, gitProvider, accessToken);
        } catch (error) {
            await addLogEntry(scanId, 'error', `Failed to fetch repository: ${error}`);
            throw error;
        }

        await addLogEntry(scanId, 'cloning', `Fetched ${files.length} source files for analysis`);
        console.log(`[realAnalysis] Fetched ${files.length} files:`, files.map(f => f.path));

        if (files.length === 0) {
            console.warn('[realAnalysis] WARNING: No files fetched from repository! Check GitHub API access.');
            await addLogEntry(scanId, 'warning', 'No source files found in repository');
        }

        // Stage 2: SAST Pattern Matching (always runs)
        console.log('[realAnalysis] Running SAST pattern matching...');
        await addLogEntry(scanId, 'sast', 'Running SAST pattern matching...');
        const sastVulns = runSASTAnalysis(files);
        console.log(`[realAnalysis] SAST found ${sastVulns.length} potential issues`);
        await addLogEntry(scanId, 'sast', `SAST found ${sastVulns.length} potential issues`);

        // Stage 3: AI Analysis (optional - only if API key provided)
        let aiResults = {
            vulnerabilities: [] as Vulnerability[],
            sbomComponents: [] as any[],
            complianceResults: [] as any[],
            executiveSummary: '',
        };

        if (geminiApiKey && geminiApiKey.length > 0) {
            console.log('[realAnalysis] Running AI analysis with Gemini...');
            await addLogEntry(scanId, 'ai_analysis', 'Running AI-powered deep analysis...');
            aiResults = await runAIAnalysis(files, geminiApiKey, metadata.ecuName);
            console.log(`[realAnalysis] AI found ${aiResults.vulnerabilities.length} additional issues`);
            await addLogEntry(scanId, 'ai_analysis', `AI found ${aiResults.vulnerabilities.length} additional issues`);
        } else {
            console.log('[realAnalysis] Skipping AI analysis (no API key)');
            await addLogEntry(scanId, 'ai_analysis', 'AI analysis skipped (no Gemini API key configured)');
        }

        // Combine vulnerabilities (SAST + AI)
        const allVulns = [...sastVulns, ...aiResults.vulnerabilities];
        console.log(`[realAnalysis] Total vulnerabilities to insert: ${allVulns.length}`);

        // Stage 4: Store results
        await addLogEntry(scanId, 'storing', 'Storing analysis results...');

        console.log(`[realAnalysis] Inserting ${allVulns.length} vulnerabilities for scan ${scanId}`);

        // Insert vulnerabilities with proper error handling
        for (const vuln of allVulns) {
            const vulnData = {
                scan_id: scanId,
                title: vuln.title,
                description: vuln.description || null,
                severity: vuln.severity as 'critical' | 'high' | 'medium' | 'low',
                cwe_id: vuln.cwe_id || null,
                cvss_score: vuln.cvss_score || null,
                affected_component: vuln.affected_component || null,
                line_number: vuln.line_number || null,
                code_snippet: vuln.code_snippet || null,
                remediation: vuln.remediation || null,
                detection_method: vuln.detection_method || 'sast',
                status: 'new' as const,
            };

            const { error } = await supabase.from('vulnerabilities').insert(vulnData);
            if (error) {
                console.error('[realAnalysis] Failed to insert vulnerability:', error, vulnData);
            } else {
                console.log('[realAnalysis] Inserted vulnerability:', vuln.title);
            }
        }

        console.log(`[realAnalysis] Inserting ${aiResults.sbomComponents.length} SBOM components`);

        // Insert SBOM components with error handling
        for (const component of aiResults.sbomComponents) {
            const { error } = await supabase.from('sbom_components').insert({
                scan_id: scanId,
                component_name: component.component_name,
                version: component.version || null,
                license: component.license || null,
            });
            if (error) {
                console.error('[realAnalysis] Failed to insert SBOM component:', error);
            }
        }

        console.log(`[realAnalysis] Inserting ${aiResults.complianceResults.length} compliance results`);

        // Insert compliance results with error handling
        for (const result of aiResults.complianceResults) {
            const { error } = await supabase.from('compliance_results').insert({
                scan_id: scanId,
                framework: result.framework,
                rule_id: result.rule_id || 'RULE-001',
                rule_description: result.rule_description || null,
                status: result.status as 'pass' | 'fail' | 'warning',
                details: result.details || null,
            });
            if (error) {
                console.error('[realAnalysis] Failed to insert compliance result:', error);
            }
        }

        // Calculate risk score
        const criticalCount = allVulns.filter(v => v.severity === 'critical').length;
        const highCount = allVulns.filter(v => v.severity === 'high').length;
        const mediumCount = allVulns.filter(v => v.severity === 'medium').length;
        const riskScore = Math.min(100, criticalCount * 25 + highCount * 15 + mediumCount * 5 + 10);

        // Complete the scan
        await supabase
            .from('scans')
            .update({
                status: 'complete',
                completed_at: new Date().toISOString(),
                risk_score: riskScore,
                executive_summary: aiResults.executiveSummary,
            })
            .eq('id', scanId);

        await addLogEntry(
            scanId,
            'complete',
            `Analysis complete. Found ${allVulns.length} vulnerabilities (${sastVulns.length} SAST + ${aiResults.vulnerabilities.length} AI). Risk score: ${riskScore}/100`
        );

    } catch (error) {
        console.error('Real analysis error:', error);

        await supabase
            .from('scans')
            .update({ status: 'failed' })
            .eq('id', scanId);

        await addLogEntry(scanId, 'error', `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
