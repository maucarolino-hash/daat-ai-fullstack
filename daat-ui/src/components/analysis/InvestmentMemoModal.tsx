
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, Download, Copy } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

interface InvestmentMemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    diagnosticId: string;
}

export function InvestmentMemoModal({ isOpen, onClose, diagnosticId }: InvestmentMemoModalProps) {
    const [loading, setLoading] = useState(false);
    const [memoContent, setMemoContent] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");

    useEffect(() => {
        if (isOpen && diagnosticId) {
            fetchMemo();
        }
    }, [isOpen, diagnosticId]);

    const fetchMemo = async () => {
        setLoading(true);
        try {
            // Remove "DAAT-" prefix if present for API call, but backend seemingly takes int PK. 
            // The diagnosticId passed here might be the string displayed version or the int.
            // Let's assume the parent passes the numeric ID or string ID that endpoint accepts.
            // If reportIdParam in parent is "123", we use that.

            // NOTE: The ID handling in frontend seems to treat it as string in URL but int in backend.
            // We'll trust the prop passed is correct for the API.
            const response = await api.post(`/api/generate-memo/${diagnosticId}/`);
            setMemoContent(response.data.memo_markdown);
            setCompanyName(response.data.company_name);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar Investment Memo.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(memoContent);
        toast.success("Memo copiado para a área de transferência!");
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([memoContent], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `Investment_Memo_${companyName || 'Startup'}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Download iniciado!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        Investment Memo
                    </DialogTitle>
                    <DialogDescription>
                        Documento formal para investidores, gerado com base na análise.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative border rounded-md bg-gray-50">
                    <ScrollArea className="h-full p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                                <p className="text-sm text-gray-500">
                                    Redigindo memorando de investimento...
                                </p>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600">
                                <ReactMarkdown>{memoContent}</ReactMarkdown>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={handleCopy} disabled={loading || !memoContent}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Texto
                    </Button>
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleDownload} disabled={loading || !memoContent}>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Markdown
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
