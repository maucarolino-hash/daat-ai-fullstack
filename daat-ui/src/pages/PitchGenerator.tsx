import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Copy, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

interface Slide {
    slide_number: number;
    section: string;
    title: string;
    content_bullets: string[];
    visual_idea: string;
    speaker_notes: string;
}

interface DeckResponse {
    deck_outline: Slide[];
    general_advice: string;
}

export default function PitchGenerator() {
    const [description, setDescription] = useState("");
    const [sector, setSector] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DeckResponse | null>(null);

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error("Por favor, descreva sua startup.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await api.post('/api/generate-deck/', {
                description,
                sector: sector || "Technology"
            });
            setResult(response.data);
            toast.success("Deck gerado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar deck. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        const text = JSON.stringify(result, null, 2);
        navigator.clipboard.writeText(text);
        toast.info("JSON copiado para a área de transferência!");
    };

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-neon-blue/10 mb-4">
                    <LayoutTemplate className="w-8 h-8 text-neon-blue" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Gerador de Pitch Deck Reverso
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transforme sua ideia em uma estrutura de apresentação validada por VCs.
                    Nossa IA aplica a lógica de "Score 100" para criar sua narrativa.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Input Column */}
                <Card className="lg:col-span-1 h-fit border-neon-blue/20 shadow-lg shadow-neon-blue/5">
                    <CardHeader>
                        <CardTitle>Dados da Startup</CardTitle>
                        <CardDescription>
                            Descreva o que você faz. Quanto mais detalhes, melhor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sector">Setor / Indústria</Label>
                            <Input
                                id="sector"
                                placeholder="Ex: Fintech, SaaS, Healthtech..."
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição do Negócio</Label>
                            <Textarea
                                id="description"
                                placeholder="Ex: Somos o Uber para passeadores de cães. Resolvemos o problema de..."
                                className="min-h-[200px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full gap-2 font-bold"
                            size="lg"
                            variant="neon"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Gerando Estrutura...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Gerar Pitch Deck
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-6">
                    {!result && !loading && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-secondary/5 text-muted-foreground">
                            <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
                            <p>Seus slides aparecerão aqui.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 w-full bg-secondary/20 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between bg-card border border-border p-4 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-neon-blue">Dica de Ouro ✨</h3>
                                    <p className="text-sm text-muted-foreground">{result.general_advice}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="shrink-0 gap-2">
                                    <Copy className="w-4 h-4" />
                                    Copiar JSON
                                </Button>
                            </div>

                            <div className="grid gap-6">
                                {result.deck_outline.map((slide) => (
                                    <div key={slide.slide_number} className="group relative">
                                        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-mono text-muted-foreground z-10">
                                            {slide.slide_number}
                                        </div>
                                        <Card className="ml-4 border-l-4 border-l-neon-blue/50 hover:border-l-neon-blue transition-all duration-300">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                            Slide: {slide.section}
                                                        </span>
                                                        <CardTitle className="text-xl mt-1 text-foreground">
                                                            {slide.title}
                                                        </CardTitle>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-neon-blue flex items-center gap-2">
                                                        🎯 Conteúdo Chave
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {slide.content_bullets.map((bullet, idx) => (
                                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-blue/50 shrink-0" />
                                                                {bullet}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="bg-secondary/20 p-3 rounded-lg text-sm">
                                                        <h4 className="font-semibold mb-1 text-xs uppercase text-muted-foreground flex items-center gap-1">
                                                            🖼️ Visual Sugerido
                                                        </h4>
                                                        <p className="text-foreground/80">{slide.visual_idea}</p>
                                                    </div>
                                                    <div className="bg-neon-purple/5 border border-neon-purple/10 p-3 rounded-lg text-sm">
                                                        <h4 className="font-semibold mb-1 text-xs uppercase text-neon-purple flex items-center gap-1">
                                                            🗣️ Speaker Notes
                                                        </h4>
                                                        <p className="text-foreground/80 italic">"{slide.speaker_notes}"</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
