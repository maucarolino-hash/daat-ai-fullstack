import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/history/ReportCard";

const reports = [
  { id: 1, title: "Análise de Mercado SaaS B2B", date: "5 Dez, 2024", status: "complete" as const, score: 87, riskLevel: "low" as const },
  { id: 2, title: "Varredura Competitiva Fintech Mobile", date: "3 Dez, 2024", status: "complete" as const, score: 72, riskLevel: "medium" as const },
  { id: 3, title: "Análise de Plataforma E-commerce", date: "1 Dez, 2024", status: "processing" as const, score: 0, riskLevel: "low" as const },
  { id: 4, title: "Análise Aprofundada SaaS Saúde", date: "28 Nov, 2024", status: "complete" as const, score: 93, riskLevel: "low" as const },
  { id: 5, title: "Análise de Entrada no Mercado EdTech", date: "25 Nov, 2024", status: "failed" as const, score: 0, riskLevel: "high" as const },
  { id: 6, title: "Comparação de Software Logística", date: "20 Nov, 2024", status: "complete" as const, score: 68, riskLevel: "medium" as const },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Histórico de Análises</h1>
        <p className="text-muted-foreground">Visualize e gerencie suas análises competitivas anteriores</p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar relatórios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Ordenar
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 glass-card">
          <p className="text-muted-foreground">Nenhum relatório encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
}
