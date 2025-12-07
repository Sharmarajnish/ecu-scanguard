import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload as UploadIcon, ArrowRight, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { MetadataForm } from '@/components/upload/MetadataForm';
import { Button } from '@/components/ui/button';
import { ScanMetadata } from '@/types/scan';
import { toast } from '@/hooks/use-toast';

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScanMetadata>({
    defaultValues: {
      ecuName: '',
      ecuType: 'Engine',
      version: '',
      manufacturer: '',
      platform: '',
      priority: 'medium',
      architecture: 'Unknown',
      enableDeepAnalysis: false,
      complianceFrameworks: ['misra-c', 'iso-21434'],
    },
  });

  const handleSubmit = async (data: ScanMetadata) => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload an ECU binary file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'Scan queued successfully',
      description: `${data.ecuName} has been queued for analysis.`,
    });

    setIsSubmitting(false);
    navigate('/scans/1'); // Navigate to mock scan
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <UploadIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Upload ECU Binary</h1>
          </div>
          <p className="text-muted-foreground">
            Upload your firmware file and configure analysis settings
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* File Upload Section */}
          <div className="glass-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Binary File</h2>
            <FileDropzone
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
          </div>

          {/* Metadata Form Section */}
          <div className="glass-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">ECU Information</h2>
            <MetadataForm form={form} />
          </div>

          {/* Analysis Info */}
          <div className="glass-card rounded-xl border border-border p-6 bg-muted/20">
            <h3 className="text-sm font-medium text-foreground mb-3">Analysis will include:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ghidra Decompilation
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Semgrep Analysis
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                YARA Pattern Matching
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI Vulnerability Enrichment
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFile || isSubmitting}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  Start Analysis
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
