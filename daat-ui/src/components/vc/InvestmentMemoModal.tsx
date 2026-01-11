
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "@/services/api";
import { toast } from "sonner";

interface InvestmentMemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    diagnosticId: number;
}

export function InvestmentMemoModal({ isOpen, onClose, diagnosticId }: InvestmentMemoModalProps) {
    const [loading, setLoading] = useState(false);
    const [memoText, setMemoText] = useState("");
    const [companyName, setCompanyName] = useState("");

    React.useEffect(() => {
        if (isOpen && diagnosticId) {
            generateMemo();
        }
    }, [isOpen, diagnosticId]);

    const generateMemo = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/generate-memo/${diagnosticId}/`);
            setMemoText(response.data.memo_markdown);
            setCompanyName(response.data.company_name || "Startup");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar Investment Memo.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([memoText], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${companyName.replace(/ /g, "_")}_Investment_Memo.md`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Investment Memo: {loading ? "Gerando..." : companyName}
                    </DialogTitle>
                    <DialogDescription>
                        Documento oficial para o Comitê de Investimento.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-4 border rounded-md bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-sm text-gray-500">Redigindo tese de investimento...</p>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none text-gray-800">
                            <ReactMarkdown>{memoText}</ReactMarkdown>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                    <Button onClick={handleDownload} disabled={loading || !memoText} className="gap-2">
                        <Download className="w-4 h-4" />
                        Baixar MD
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
