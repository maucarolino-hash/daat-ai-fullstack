
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MonitorPlay, Zap, Lightbulb } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ImprovedDeckModalProps {
    isOpen: boolean;
    onClose: () => void;
    diagnosticId: number;
}

export function ImprovedDeckModal({ isOpen, onClose, diagnosticId }: ImprovedDeckModalProps) {
    const [loading, setLoading] = useState(false);
    const [deckStructure, setDeckStructure] = useState<any>(null);

    React.useEffect(() => {
        if (isOpen && diagnosticId) {
            generateImprovedDeck();
        }
    }, [isOpen, diagnosticId]);

    const generateImprovedDeck = async () => {
        setLoading(true);
        setDeckStructure(null);
        try {
            const response = await api.post(`/generate-improved-deck/${diagnosticId}/`);
            setDeckStructure(response.data);
            toast.success("Deck Otimizado Gerado!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar deck.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col bg-slate-50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5 text-indigo-600" />
                        Deck Otimizado pela IA
                    </DialogTitle>
                    <DialogDescription>
                        Esta estrutura foi reconstruída para mitigar os riscos e aumentar o score.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                            <p className="text-sm text-gray-500">
                                Analisando fraquezas e reescrevendo roteiro...
                            </p>
                        </div>
                    ) : deckStructure?.slides ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                            {deckStructure.slides.map((slide: any) => (
                                <Card key={slide.slide_number} className="border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="bg-white">Slide {slide.slide_number}</Badge>
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-800 leading-tight mt-2">
                                            {slide.title}
                                        </CardTitle>
                                        <p className="text-xs text-gray-500 italic">{slide.objective}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div className="bg-white p-3 rounded border border-gray-100">
                                            <ul className="list-disc pl-4 space-y-1 text-gray-700">
                                                {slide.content_bullets.map((b: string, i: number) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-blue-50 p-2 rounded text-blue-800">
                                                <div className="font-semibold flex items-center gap-1 mb-1">
                                                    <Zap className="w-3 h-3" /> Design
                                                </div>
                                                {slide.design_tips.join(", ")}
                                            </div>
                                            <div className="bg-amber-50 p-2 rounded text-amber-800">
                                                <div className="font-semibold flex items-center gap-1 mb-1">
                                                    <Lightbulb className="w-3 h-3" /> Falar
                                                </div>
                                                {slide.speaking_notes}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">Nenhum dado gerado.</div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
