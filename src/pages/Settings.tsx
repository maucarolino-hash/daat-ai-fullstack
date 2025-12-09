import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Key, Bell, CreditCard, Save, Webhook } from "lucide-react";
import { toast } from "sonner";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { usePreferences } from "@/hooks/usePreferences";

export default function Settings() {
  const { isDarkMode, reducedMotion, toggleTheme, setReducedMotion } = usePreferences();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-card p-1 bg-secondary/50">
          <TabsTrigger value="general" className="data-[state=active]:bg-background gap-2">
            <User className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-background gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-background gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-background gap-2">
            <Webhook className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* User Profile */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Inc" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Product Manager" className="bg-secondary border-border" />
              </div>
            </div>
          </div>

          {/* Interface Preferences */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Interface Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <span className="text-sm font-medium text-foreground">Dark Mode</span>
                  <p className="text-xs text-muted-foreground">Use dark theme across the app</p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <span className="text-sm font-medium text-foreground">Reduced Motion</span>
                  <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value="sk-xxxx-xxxx-xxxx-xxxx"
                    className="bg-secondary border-border font-mono"
                    readOnly
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Your secret API key for programmatic access</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input
                  id="webhook"
                  placeholder="https://your-app.com/webhook"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
            <div className="space-y-4">
              {[
                { label: "Analysis Complete", desc: "Get notified when your analysis is done" },
                { label: "Risk Alerts", desc: "Receive alerts for new detected risks" },
                { label: "Weekly Digest", desc: "Summary of market changes every week" },
                { label: "Competitor Updates", desc: "Real-time updates on competitor moves" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-foreground">Pro Plan</span>
                  <p className="text-sm text-muted-foreground">500 credits / month</p>
                </div>
                <span className="text-2xl font-bold neon-text-purple">$99/mo</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View Invoices</Button>
              <Button variant="cyber">Upgrade Plan</Button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Credit Usage</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credits Used</span>
                <span className="text-foreground font-medium">347 / 500</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full gradient-progress"
                  style={{ width: "69.4%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Resets on January 1, 2025</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
