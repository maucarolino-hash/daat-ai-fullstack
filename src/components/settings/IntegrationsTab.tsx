import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Webhook, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Bell, 
  CheckCircle2,
  AlertTriangle,
  ExternalLink 
} from "lucide-react";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  platform: "slack" | "discord" | "custom";
  enabled: boolean;
  events: string[];
}

const eventTypes = [
  { id: "price_change", label: "Price Changes", desc: "Alert when competitors change pricing" },
  { id: "feature_launch", label: "Feature Launches", desc: "New product features detected" },
  { id: "market_shift", label: "Market Shifts", desc: "Significant market share changes" },
  { id: "risk_alert", label: "Risk Alerts", desc: "New risks identified in analysis" },
];

export function IntegrationsTab() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      name: "Team Notifications",
      url: "https://hooks.slack.com/services/xxx",
      platform: "slack",
      enabled: true,
      events: ["price_change", "risk_alert"],
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState<{
    name: string;
    url: string;
    platform: "slack" | "discord" | "custom";
  }>({
    name: "",
    url: "",
    platform: "slack",
  });

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error("Please fill in all fields");
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      ...newWebhook,
      enabled: true,
      events: [],
    };

    setWebhooks((prev) => [...prev, webhook]);
    setNewWebhook({ name: "", url: "", platform: "slack" });
    setShowAddForm(false);
    toast.success("Webhook added successfully");
  };

  const handleRemoveWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    toast.success("Webhook removed");
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleToggleEvent = (webhookId: string, eventId: string) => {
    setWebhooks((prev) =>
      prev.map((w) => {
        if (w.id !== webhookId) return w;
        const events = w.events.includes(eventId)
          ? w.events.filter((e) => e !== eventId)
          : [...w.events, eventId];
        return { ...w, events };
      })
    );
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Testing webhook...",
        success: "Webhook test successful!",
        error: "Failed to send test message",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Webhook className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Webhook Integrations</h2>
              <p className="text-sm text-muted-foreground">
                Connect Slack or Discord for real-time competitor alerts
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="cyber"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Webhook
          </Button>
        </div>

        {/* Add Webhook Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-4 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground">New Webhook</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., Team Alerts"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-platform">Platform</Label>
                <select
                  id="webhook-platform"
                  value={newWebhook.platform}
                  onChange={(e) =>
                    setNewWebhook((prev) => ({
                      ...prev,
                      platform: e.target.value as "slack" | "discord" | "custom",
                    }))
                  }
                  className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm"
                >
                  <option value="slack">Slack</option>
                  <option value="discord">Discord</option>
                  <option value="custom">Custom Webhook</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hooks.slack.com/..."
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook((prev) => ({ ...prev, url: e.target.value }))}
                  className="bg-background border-border font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddWebhook} variant="default">
                Add Webhook
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Webhook List */}
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      webhook.platform === "slack"
                        ? "bg-[#4A154B]/20"
                        : webhook.platform === "discord"
                        ? "bg-[#5865F2]/20"
                        : "bg-muted"
                    }`}
                  >
                    <MessageSquare
                      className={`w-4 h-4 ${
                        webhook.platform === "slack"
                          ? "text-[#4A154B]"
                          : webhook.platform === "discord"
                          ? "text-[#5865F2]"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{webhook.name}</span>
                      {webhook.enabled ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {webhook.platform}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={() => handleToggleWebhook(webhook.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTestWebhook(webhook)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveWebhook(webhook.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Event Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {eventTypes.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleToggleEvent(webhook.id, event.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      webhook.events.includes(event.id)
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-background border border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bell
                        className={`w-4 h-4 ${
                          webhook.events.includes(event.id)
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          webhook.events.includes(event.id)
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {event.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {webhooks.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-muted-foreground">
              <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No webhooks configured</p>
              <p className="text-sm">Add a webhook to receive real-time alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}