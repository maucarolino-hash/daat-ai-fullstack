import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Key, Bell, CreditCard, Save, Webhook, Sun, Moon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { usePreferences } from "@/hooks/usePreferences";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { isDarkMode, reducedMotion, toggleTheme, setReducedMotion } = usePreferences();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCompany(profile.company || "");
      setRole(profile.role || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const { error } = await updateProfile({
      full_name: fullName || null,
      company: company || null,
      role: role || null,
    });

    if (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    } else {
      toast.success("Configurações salvas com sucesso");
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl px-1 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Configurações</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-card p-1 bg-secondary/50 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-background gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <User className="w-4 h-4" />
            <span className="hidden xs:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-background gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Key className="w-4 h-4" />
            <span className="hidden xs:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-background gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Faturamento</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-background gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Webhook className="w-4 h-4" />
            <span className="hidden sm:inline">Integrações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* User Profile */}
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Perfil do Usuário</h2>
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="João Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    className="bg-secondary border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    placeholder="Gerente de Produto"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interface Preferences */}
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Preferências de Interface</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-accent" />
                  ) : (
                    <Sun className="w-5 h-5 text-neon-orange" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {isDarkMode ? "Modo Escuro" : "Modo Claro"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {isDarkMode ? "Tema escuro ativado" : "Tema claro ativado"}
                    </p>
                  </div>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <span className="text-sm font-medium text-foreground">Movimento Reduzido</span>
                  <p className="text-xs text-muted-foreground">Minimizar animações e transições</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} variant="default" disabled={isSaving || profileLoading}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Configuração de API</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave de API</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value="sk-xxxx-xxxx-xxxx-xxxx"
                    className="bg-secondary border-border font-mono text-xs sm:text-sm"
                    readOnly
                  />
                  <Button variant="outline" className="w-full sm:w-auto">Regenerar</Button>
                </div>
                <p className="text-xs text-muted-foreground">Sua chave secreta de API para acesso programático</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook">URL do Webhook</Label>
                <Input
                  id="webhook"
                  placeholder="https://seu-app.com/webhook"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Configurações de Notificações</h2>
            <div className="space-y-4">
              {[
                { label: "Análise Concluída", desc: "Receba notificação quando sua análise estiver pronta" },
                { label: "Alertas de Risco", desc: "Receba alertas para novos riscos detectados" },
                { label: "Resumo Semanal", desc: "Resumo das mudanças de mercado toda semana" },
                { label: "Atualizações de Concorrentes", desc: "Atualizações em tempo real sobre movimentações dos concorrentes" },
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
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Plano Atual</h2>
            <div className="p-3 sm:p-4 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-base sm:text-lg font-bold text-foreground">Plano Pro</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">500 créditos / mês</p>
                </div>
                <span className="text-xl sm:text-2xl font-bold neon-text-purple">R$499/mês</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button variant="outline" className="w-full sm:w-auto">Ver Faturas</Button>
              <Button variant="cyber" className="w-full sm:w-auto">Upgrade do Plano</Button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Uso de Créditos</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Créditos Usados</span>
                <span className="text-foreground font-medium">347 / 500</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full gradient-progress"
                  style={{ width: "69.4%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Renova em 1 de Janeiro de 2025</p>
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
