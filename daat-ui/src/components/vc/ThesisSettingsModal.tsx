
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Sparkles, Save, RotateCcw } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

export function ThesisSettingsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thesisText, setThesisText] = useState("");

    // Default weights matching backend
    const [weights, setWeights] = useState({
        tracao: 0.25,
        mercado: 0.20,
        equipe: 0.15,
        produto: 0.15,
        unit_econ: 0.10,
        riscos: 0.10,
        ask: 0.05
    });

    const handleGenerateWeights = async () => {
        if (!thesisText) return toast.error("Descreva sua tese primeiro.");

        setLoading(true);
        try {
            const response = await api.post("/configure-thesis/", { thesis: thesisText });
            if (response.data.weights) {
                setWeights(response.data.weights);
                toast.success("Pesos recalibrados com sucesso!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar configuração.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        // In a real app, save to UserContext or Backend UserProfile
        // For MVP, likely verifying functionality or saving to localStorage
        localStorage.setItem("daat_thesis_weights", JSON.stringify(weights));
        toast.success("Configuração salva localmente.");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Configurar Tese
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Configuração da Tese de Investimento</DialogTitle>
                    <DialogDescription>
                        Descreva o foco do seu fundo e a IA ajustará os pesos do algoritmo de scoring automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Descrição da Tese</Label>
                        <Textarea
                            placeholder="Ex: Fundo early-stage focado em B2B SaaS Latam. Valorizamos unit economics sólidos e founders técnicos, toleramos risco de mercado inicial."
                            value={thesisText}
                            onChange={(e) => setThesisText(e.target.value)}
                            className="h-24"
                        />
                        <Button onClick={handleGenerateWeights} disabled={loading} size="sm" className="w-full gap-2">
                            {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Calibrar Pesos com IA
                        </Button>
                    </div>

                    <div className="space-y-3 mt-2">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pesos do Algoritmo</Label>
                        {Object.entries(weights).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                                <span className="capitalize w-24">{key.replace('_', ' ')}</span>
                                <div className="flex-1 mx-2 bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full" style={{ width: `${value * 100}%` }} />
                                </div>
                                <span className="w-12 text-right text-gray-600">{(value * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-xs text-gray-400 pt-1 border-t">
                            <span>Total</span>
                            <span>{(Object.values(weights).reduce((a, b) => a + b, 0) * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800 w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Configuração
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
