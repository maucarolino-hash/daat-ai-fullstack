import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

interface FeedbackModalProps {
    diagnosticId: string | number;
    trigger?: React.ReactNode;
}

export function FeedbackModal({ diagnosticId, trigger }: FeedbackModalProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState("General");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Por favor, selecione uma nota.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post('/api/feedback/', {
                diagnostic: diagnosticId,
                rating,
                category,
                feedback_text: comment
            });

            toast.success("Feedback enviado! Obrigado por ajudar a melhorar o Daat.");
            setOpen(false);
            // Reset form
            setRating(0);
            setComment("");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao enviar feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Avaliar Análise
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Avaliar Análise</DialogTitle>
                    <DialogDescription>
                        Ajude-nos a calibrar o modelo. Seu feedback melhora as próximas análises.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2 items-center justify-center py-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 hover:scale-110 transition-transform ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                >
                                    <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {rating === 1 && "Fraco"}
                            {rating === 2 && "Razoável"}
                            {rating === 3 && "Bom"}
                            {rating === 4 && "Muito Bom"}
                            {rating === 5 && "Excelente"}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">O que você está avaliando?</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">Avaliação Geral</SelectItem>
                                <SelectItem value="Score">Score (Muito Alto/Baixo)</SelectItem>
                                <SelectItem value="Metrics">Métricas (Dados Incorretos)</SelectItem>
                                <SelectItem value="Recommendations">Recomendações (Não Úteis)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="comment">Comentários Adicionais</Label>
                        <Textarea
                            id="comment"
                            placeholder="O que poderiamos ter feito melhor?..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
