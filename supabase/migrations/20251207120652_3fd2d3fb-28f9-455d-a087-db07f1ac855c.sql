-- Create enum types
CREATE TYPE public.scan_status AS ENUM ('queued', 'parsing', 'decompiling', 'analyzing', 'enriching', 'complete', 'failed');
CREATE TYPE public.severity_level AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE public.vulnerability_status AS ENUM ('new', 'reopened', 'fixed', 'false_positive', 'risk_accepted');
CREATE TYPE public.compliance_status AS ENUM ('pass', 'fail', 'warning');

-- Scans table
CREATE TABLE public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ecu_name VARCHAR(255) NOT NULL,
    ecu_type VARCHAR(100) NOT NULL,
    version VARCHAR(100),
    manufacturer VARCHAR(255),
    platform VARCHAR(255),
    file_name VARCHAR(255) NOT NULL,
    file_hash VARCHAR(64),
    file_size BIGINT,
    architecture VARCHAR(50) DEFAULT 'ARM',
    status scan_status DEFAULT 'queued',
    progress INTEGER DEFAULT 0,
    deep_analysis BOOLEAN DEFAULT false,
    executive_summary TEXT,
    risk_score INTEGER,
    compliance_frameworks TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scans" ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scans" ON public.scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scans" ON public.scans FOR DELETE USING (auth.uid() = user_id);

-- Vulnerabilities table
CREATE TABLE public.vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
    cve_id VARCHAR(50),
    cwe_id VARCHAR(50),
    severity severity_level NOT NULL DEFAULT 'medium',
    cvss_score DECIMAL(3,1),
    title TEXT NOT NULL,
    description TEXT,
    affected_component VARCHAR(255),
    affected_function VARCHAR(255),
    code_snippet TEXT,
    line_number INTEGER,
    detection_method VARCHAR(100),
    status vulnerability_status DEFAULT 'new',
    remediation TEXT,
    attack_vector TEXT,
    impact TEXT,
    llm_enrichment JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vulnerabilities of their scans" ON public.vulnerabilities FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE scans.id = vulnerabilities.scan_id AND scans.user_id = auth.uid())
);
CREATE POLICY "Users can update vulnerabilities of their scans" ON public.vulnerabilities FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.scans WHERE scans.id = vulnerabilities.scan_id AND scans.user_id = auth.uid())
);

-- Compliance results table
CREATE TABLE public.compliance_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
    framework VARCHAR(100) NOT NULL,
    rule_id VARCHAR(100) NOT NULL,
    rule_description TEXT,
    status compliance_status DEFAULT 'pass',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.compliance_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view compliance results of their scans" ON public.compliance_results FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE scans.id = compliance_results.scan_id AND scans.user_id = auth.uid())
);

-- SBOM components table
CREATE TABLE public.sbom_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    license VARCHAR(100),
    source_file VARCHAR(255),
    vulnerabilities JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sbom_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view SBOM of their scans" ON public.sbom_components FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE scans.id = sbom_components.scan_id AND scans.user_id = auth.uid())
);

-- Analysis logs table
CREATE TABLE public.analysis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
    stage VARCHAR(50) NOT NULL,
    log_level VARCHAR(20) DEFAULT 'info',
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs of their scans" ON public.analysis_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE scans.id = analysis_logs.scan_id AND scans.user_id = auth.uid())
);

-- CVE cache table
CREATE TABLE public.cve_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cve_id VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    cvss_score DECIMAL(3,1),
    severity VARCHAR(20),
    published_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    reference_links JSONB DEFAULT '[]',
    cwe_ids TEXT[],
    affected_products JSONB DEFAULT '[]',
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.cve_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read CVE cache" ON public.cve_cache FOR SELECT USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scans_updated_at BEFORE UPDATE ON public.scans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON public.vulnerabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.scans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis_logs;

-- Indexes
CREATE INDEX idx_scans_user_id ON public.scans(user_id);
CREATE INDEX idx_scans_status ON public.scans(status);
CREATE INDEX idx_vulnerabilities_scan_id ON public.vulnerabilities(scan_id);
CREATE INDEX idx_vulnerabilities_severity ON public.vulnerabilities(severity);
CREATE INDEX idx_compliance_scan_id ON public.compliance_results(scan_id);
CREATE INDEX idx_sbom_scan_id ON public.sbom_components(scan_id);
CREATE INDEX idx_logs_scan_id ON public.analysis_logs(scan_id);
CREATE INDEX idx_cve_cache_cve_id ON public.cve_cache(cve_id);