import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCode, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const acceptedFormats = {
  'application/octet-stream': ['.vbf', '.bin', '.hex', '.elf', '.s19', '.srec'],
  'text/plain': ['.c', '.h', '.cpp', '.hpp'],
  'text/xml': ['.arxml', '.xml'],
  'application/xml': ['.arxml', '.xml'],
};

const allExtensions = ['.vbf', '.bin', '.hex', '.elf', '.s19', '.srec', '.c', '.h', '.arxml'];

export function FileDropzone({ onFileSelect, selectedFile, onClear }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Invalid file format. Please upload VBF, binary, C source, or AUTOSAR files.');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
            isDragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            error && "border-destructive"
          )}
        >
          <input {...getInputProps()} />
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan" />
            </div>
          </div>

          <div className="relative z-10">
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300",
              isDragActive ? "bg-primary/20 scale-110" : "bg-muted"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragActive ? 'Drop your ECU binary here' : 'Upload ECU Binary'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your firmware file, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {allExtensions.map((ext) => (
                <span 
                  key={ext}
                  className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">VBF, ANSI C, AUTOSAR • Max 100MB</p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-6 bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <FileCode className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{selectedFile.name}</h4>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span>•</span>
                <span className="font-mono">{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}
    </div>
  );
}
