
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/services/api";
import { Upload, FileText, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ThesisSettingsModal } from "@/components/vc/ThesisSettingsModal";
import { InvestmentMemoModal } from "@/components/vc/InvestmentMemoModal";
import { ImprovedDeckModal } from "@/components/vc/ImprovedDeckModal";

interface Diagnostic {
    id: number;
    company_name?: string;
    customer_segment: string;
    score: number;
    recommendation?: string;
    created_at: string;
    feedback?: string;
    value_proposition?: string;
}

const VCDashboard = () => {
    const [deals, setDeals] = useState<Diagnostic[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const response = await api.get("/history/");
            // Map history to deal structure if needed, or api returns it directly
            // Note: Backend 'get_history' returns { history: [...] }
            setDeals(response.data.history);
        } catch (error) {
            console.error("Error fetching deals:", error);
            toast.error("Failed to load dealflow.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const handleBatchUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        toast.info(`Uploading ${files.length} decks...`);

        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("pitch_deck", file);
            // Dummy data for batch
            formData.append("customerSegment", "Batch Upload");
            formData.append("problem", "Analise Automatica");
            formData.append("valueProposition", "VC Screening");

            try {
                await api.post("/analyze/", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                successCount++;
                toast.success(`Enqueued: ${file.name}`);
            } catch (err) {
                console.error(err);
                toast.error(`Failed: ${file.name}`);
            }
        }

        setUploading(false);
        toast.success(`Batch Complete. ${successCount}/${files.length} processing.`);
        // Trigger refresh after a delay or let user do it
        setTimeout(fetchDeals, 2000);
    };

    const getRecColor = (rec?: string) => {
        if (!rec) return "secondary";
        if (rec.includes("Invest")) return "default"; // Black/Primary
        if (rec.includes("Watchlist")) return "outline";
        return "destructive";
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 font-bold";
        if (score >= 60) return "text-yellow-600 font-bold";
        return "text-red-600 font-bold";
    };


    // State for Memo Modal
    const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
    const [isMemoOpen, setIsMemoOpen] = useState(false);
    const [isDeckOpen, setIsDeckOpen] = useState(false); // Improve Modal

    const openMemo = (id: number) => {
        setSelectedDealId(id);
        setIsMemoOpen(true);
    };

    const openDeckRemake = (id: number) => {
        setSelectedDealId(id);
        setIsDeckOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <InvestmentMemoModal
                isOpen={isMemoOpen}
                onClose={() => setIsMemoOpen(false)}
                diagnosticId={selectedDealId || 0}
            />
            <ImprovedDeckModal
                isOpen={isDeckOpen}
                onClose={() => setIsDeckOpen(false)}
                diagnosticId={selectedDealId || 0}
            />
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">VC Dealflow</h1>
                        <p className="text-gray-500 mt-1">
                            AI-Powered Screening & Due Diligence Dashboard
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={fetchDeals} disabled={loading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <ThesisSettingsModal />
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleBatchUpload}
                                disabled={uploading}
                            />
                            <Button disabled={uploading} className="bg-black text-white hover:bg-gray-800">
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                Batch Upload Decks
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards (Mock) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Deals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{deals.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Avg Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {deals.length > 0 ? Math.round(deals.reduce((a, b) => a + b.score, 0) / deals.length) : 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Green Light (&gt;80)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {deals.filter(d => d.score >= 80).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {deals.filter(d => (d.feedback || "").includes("Processando")).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Deal Table */}
                <Card className="border-none shadow-md">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="w-[300px]">Startup / File</TableHead>
                                    <TableHead>Sector</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Recommendation</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deals.map((deal) => {
                                    // Fallback logic if fields are missing in older records
                                    const rec = deal.recommendation || (deal.score >= 80 ? 'Invest' : deal.score >= 60 ? 'Watchlist' : 'Pass');
                                    const name = deal.company_name || `Startup #${deal.id}`;
                                    const isProcessing = (deal.feedback || "").includes("Processando");

                                    return (
                                        <TableRow key={deal.id} className="hover:bg-gray-50/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                                                        {name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{isProcessing ? "Analyzing..." : name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{deal.value_proposition}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal text-gray-600">
                                                    {deal.customer_segment}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                ) : (
                                                    <span className={getScoreColor(deal.score)}>{deal.score}/100</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isProcessing ? (
                                                    <span className="text-xs text-gray-400">Computing...</span>
                                                ) : (
                                                    <Badge variant={rec.includes("Invest") ? "default" : rec.includes("Watchlist") ? "outline" : "destructive"}>
                                                        {rec}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm">
                                                {new Date(deal.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => openMemo(deal.id)}
                                                >
                                                    View Memo <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    onClick={() => openDeckRemake(deal.id)}
                                                    title="Gerar Deck Melhorado"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {deals.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                                            No deals found. Drag & drop PDF pitch decks to start screening.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default VCDashboard;
