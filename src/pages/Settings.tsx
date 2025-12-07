import { Settings as SettingsIcon, Key, Bell, Shield, Database, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Settings() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your ECU Scanner preferences</p>
          </div>
        </div>

        {/* API Keys */}
        <Card className="glass-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure API keys for external integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key (Claude)</Label>
              <Input
                id="anthropic"
                type="password"
                placeholder="sk-ant-..."
                className="bg-muted/50 font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Used for AI-powered vulnerability enrichment and remediation suggestions
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nvd">NVD API Key</Label>
              <Input
                id="nvd"
                type="password"
                placeholder="Enter your NVD API key"
                className="bg-muted/50 font-mono"
              />
              <p className="text-xs text-muted-foreground">
                For enhanced CVE database queries (optional but recommended)
              </p>
            </div>
            <Button className="mt-4">Save API Keys</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Vulnerability Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified immediately when critical vulnerabilities are found
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Scan Completion Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a notification when a scan completes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Summary Report</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly email summary of all security findings
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Settings */}
        <Card className="glass-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Analysis Settings</CardTitle>
            </div>
            <CardDescription>
              Configure default analysis parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Deep Analysis by Default</Label>
                <p className="text-sm text-muted-foreground">
                  Perform symbolic execution and taint analysis on all scans
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-generate SBOM</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically extract Software Bill of Materials
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>AI Remediation Suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Use AI to generate remediation guidance for findings
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="glass-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle>Database & Storage</CardTitle>
            </div>
            <CardDescription>
              Manage data retention and storage settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
              <div>
                <div className="text-2xl font-bold text-foreground font-mono">24</div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground font-mono">1.2 GB</div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export All Data</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Clear Old Scans
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Settings */}
        <Card className="glass-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Team & Access</CardTitle>
            </div>
            <CardDescription>
              Manage team members and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">SA</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Security Analyst</div>
                    <div className="text-xs text-muted-foreground">admin@example.com</div>
                  </div>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Admin</span>
              </div>
              <Button variant="outline" className="w-full">Invite Team Member</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
