import { useState, useEffect } from "react";
import api from "@/services/api";
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
  { id: "price_change", label: "Mudanças de Preço", desc: "Alerta quando concorrentes alteram preços" },
  { id: "feature_launch", label: "Lançamento de Recursos", desc: "Novos recursos de produto detectados" },
  { id: "market_shift", label: "Mudanças de Mercado", desc: "Alterações significativas de participação" },
  { id: "risk_alert", label: "Alertas de Risco", desc: "Novos riscos identificados na análise" },
];

/* REAL API INTEGRATION */
export function IntegrationsTab() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch Webhooks on Mount
  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/api/webhooks/');

      // Adapt backend data to frontend interface if needed
      // Backend returns: snake_case (is_active)
      // Frontend expects: camelCase (enabled)?
      // Let's standardize on camelCase for the component state but map from backend.

      const mapped = data.map((w: any) => ({
        id: w.id.toString(),
        name: w.name,
        url: w.url,
        platform: w.platform,
        enabled: w.is_active,
        events: w.events || []
      }));
      setWebhooks(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar integrações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const payload = {
        name: newWebhook.name,
        url: newWebhook.url,
        platform: newWebhook.platform,
        is_active: true,
        events: []
      };

      const { data } = await api.post('/api/webhooks/', payload);

      const created = {
        id: data.id.toString(),
        name: data.name,
        url: data.url,
        platform: data.platform,
        enabled: data.is_active,
        events: data.events
      };

      setWebhooks((prev) => [created, ...prev]);
      setNewWebhook({ name: "", url: "", platform: "slack" });
      setShowAddForm(false);
      toast.success("Webhook adicionado com sucesso");
    } catch (err) {
      toast.error("Erro ao criar webhook.");
    }
  };

  const handleRemoveWebhook = async (id: string) => {
    try {
      await api.delete(`/api/webhooks/${id}/`);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      toast.success("Webhook removido");
    } catch (err) {
      toast.error("Erro ao remover webhook.");
    }
  };

  const handleToggleWebhook = async (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;

    // Optimistic Update
    const newState = !webhook.enabled;
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: newState } : w))
    );

    try {
      await api.patch(`/api/webhooks/${id}/`, { is_active: newState });
    } catch (err) {
      // Revert on error
      setWebhooks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, enabled: !newState } : w))
      );
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleToggleEvent = async (webhookId: string, eventId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    let newEvents = webhook.events.includes(eventId)
      ? webhook.events.filter((e) => e !== eventId)
      : [...webhook.events, eventId];

    // Optimistic Update
    setWebhooks((prev) =>
      prev.map((w) => {
        if (w.id !== webhookId) return w;
        return { ...w, events: newEvents };
      })
    );

    try {
      await api.patch(`/api/webhooks/${webhookId}/`, { events: newEvents });
    } catch (err) {
      // Revert
      setWebhooks((prev) =>
        prev.map((w) => {
          if (w.id !== webhookId) return w;
          return { ...w, events: webhook.events };
        })
      );
      toast.error("Erro ao salvar eventos.");
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    // Ideally this would hit a backend endpoint /api/webhooks/{id}/test/
    // For now we simulate
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Testando webhook...",
        success: "Simulação de teste enviada!",
        error: "Falha ao enviar mensagem de teste",
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
              <h2 className="text-lg font-semibold text-foreground">Integrações de Webhook</h2>
              <p className="text-sm text-muted-foreground">
                Conecte Slack ou Discord para alertas de concorrentes em tempo real
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="cyber"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Webhook
          </Button>
        </div>

        {/* Add Webhook Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-4 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground">Novo Webhook</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Nome</Label>
                <Input
                  id="webhook-name"
                  placeholder="ex: Alertas da Equipe"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-platform">Plataforma</Label>
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
                  <option value="custom">Webhook Personalizado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
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
                Adicionar Webhook
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancelar
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
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${webhook.platform === "slack"
                      ? "bg-[#4A154B]/20"
                      : webhook.platform === "discord"
                        ? "bg-[#5865F2]/20"
                        : "bg-muted"
                      }`}
                  >
                    <MessageSquare
                      className={`w-4 h-4 ${webhook.platform === "slack"
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
                    className={`p-3 rounded-lg text-left transition-all ${webhook.events.includes(event.id)
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-background border border-border hover:border-muted-foreground/50"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bell
                        className={`w-4 h-4 ${webhook.events.includes(event.id)
                          ? "text-primary"
                          : "text-muted-foreground"
                          }`}
                      />
                      <span
                        className={`text-xs font-medium ${webhook.events.includes(event.id)
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
              <p>Nenhum webhook configurado</p>
              <p className="text-sm">Adicione um webhook para receber alertas em tempo real</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
