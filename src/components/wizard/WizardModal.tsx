import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDaatEngine } from "@/lib/daat-engine/context";

interface WizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: "Escopo", description: "Defina sua análise" },
  { id: 2, title: "Fontes de Dados", description: "Selecione provedores" },
  { id: 3, title: "Revisão", description: "Confirme e inicie" },
];

const dataSources = [
  { id: "tavily", name: "Tavily AI", description: "Pesquisa de mercado com IA" },
  { id: "crunchbase", name: "Crunchbase", description: "Dados de empresas e investimentos" },
  { id: "semrush", name: "SEMRush", description: "Dados de SEO e marketing" },
  { id: "linkedin", name: "LinkedIn", description: "Dados de funcionários e contratações" },
];

export function WizardModal({ open, onOpenChange }: WizardModalProps) {
  const navigate = useNavigate();
  const { startAnalysis } = useDaatEngine();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [segment, setSegment] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [deepDive, setDeepDive] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(["tavily", "crunchbase"]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!segment.trim()) {
      toast.error("Segmento obrigatório", {
        description: "Por favor, informe o segmento de mercado para análise.",
      });
      return;
    }

    setLoading(true);
    
    // Parse competitors
    const competitorList = competitors
      .split("\n")
      .map(c => c.trim())
      .filter(Boolean);

    // Start the Daat Engine analysis
    startAnalysis(segment, competitorList);
    
    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setLoading(false);
    onOpenChange(false);
    
    toast.success("Motor Daat AI Iniciado!", {
      description: "Acompanhe o progresso no terminal de análise.",
      icon: <Zap className="w-4 h-4 text-accent" />,
    });
    
    // Navigate to dashboard to see the terminal
    navigate('/dashboard');
    
    // Reset form
    setCurrentStep(1);
    setSegment("");
    setCompetitors("");
    setDeepDive(false);
    setSelectedSources(["tavily", "crunchbase"]);
  };

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const creditCost = 15 + (deepDive ? 10 : 0) + selectedSources.length * 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Nova Análise Daat
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-2",
                    currentStep > step.id ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[200px]">
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Segmento de Mercado *
                </label>
                <Input
                  placeholder="ex: SaaS B2B, Fintech Mobile, HealthTech"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O Motor Daat usará isso para buscar concorrentes e dados de mercado
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Concorrentes Conhecidos (opcional)
                </label>
                <Textarea
                  placeholder="Acme Corp&#10;Globex Inc&#10;Umbrella Corp"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <span className="text-sm font-medium text-foreground">Análise Aprofundada</span>
                  <p className="text-xs text-muted-foreground">Coleta de dados estendida (+10 créditos)</p>
                </div>
                <Switch checked={deepDive} onCheckedChange={setDeepDive} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Selecione as fontes de dados para o Motor Daat
              </p>
              {dataSources.map((source) => (
                <label
                  key={source.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedSources.includes(source.id)
                      ? "bg-accent/10 border border-accent/30"
                      : "bg-secondary border border-transparent hover:border-border"
                  )}
                >
                  <Checkbox
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{source.name}</span>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-lg bg-secondary space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Segmento</span>
                  <span className="text-foreground">{segment || "Não especificado"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Concorrentes</span>
                  <span className="text-foreground">
                    {competitors.split("\n").filter(Boolean).length} empresas
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Análise Aprofundada</span>
                  <span className={deepDive ? "text-primary" : "text-muted-foreground"}>
                    {deepDive ? "Ativada" : "Desativada"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fontes de Dados</span>
                  <span className="text-foreground">{selectedSources.length} selecionadas</span>
                </div>
              </div>

              {/* Daat Engine Info */}
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">Motor Daat AI</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Processo de análise em 4 fases: Pesquisa de Mercado → Análise Crítica → Algoritmo de Pontuação → Consultoria Estratégica
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Custo Estimado</span>
                  <span className="text-2xl font-bold neon-text-purple">{creditCost} Créditos</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} variant="cyber" className="gap-1">
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="neon" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Iniciar Análise Daat
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
