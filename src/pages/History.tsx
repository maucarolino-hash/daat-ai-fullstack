import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/history/ReportCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const reports = [
  { id: 1, title: "Análise de Mercado SaaS B2B", date: "5 Dez, 2024", status: "complete" as const, score: 87, riskLevel: "low" as const },
  { id: 2, title: "Varredura Competitiva Fintech Mobile", date: "3 Dez, 2024", status: "complete" as const, score: 72, riskLevel: "medium" as const },
  { id: 3, title: "Análise de Plataforma E-commerce", date: "1 Dez, 2024", status: "processing" as const, score: 0, riskLevel: "low" as const },
  { id: 4, title: "Análise Aprofundada SaaS Saúde", date: "28 Nov, 2024", status: "complete" as const, score: 93, riskLevel: "low" as const },
  { id: 5, title: "Análise de Entrada no Mercado EdTech", date: "25 Nov, 2024", status: "failed" as const, score: 0, riskLevel: "high" as const },
  { id: 6, title: "Comparação de Software Logística", date: "20 Nov, 2024", status: "complete" as const, score: 68, riskLevel: "medium" as const },
];

type SortOption = "date-desc" | "date-asc" | "score-desc" | "score-asc" | "name-asc" | "name-desc";
type StatusFilter = "all" | "complete" | "processing" | "failed";
type RiskFilter = "all" | "low" | "medium" | "high";

const sortLabels: Record<SortOption, string> = {
  "date-desc": "Mais recentes",
  "date-asc": "Mais antigos",
  "score-desc": "Maior pontuação",
  "score-asc": "Menor pontuação",
  "name-asc": "Nome (A-Z)",
  "name-desc": "Nome (Z-A)",
};

const statusLabels: Record<StatusFilter, string> = {
  all: "Todos os status",
  complete: "Concluídos",
  processing: "Processando",
  failed: "Falhos",
};

const riskLabels: Record<RiskFilter, string> = {
  all: "Todos os riscos",
  low: "Risco Baixo",
  medium: "Risco Médio",
  high: "Risco Alto",
};

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter((report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((report) => report.riskLevel === riskFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "score-desc":
          return b.score - a.score;
        case "score-asc":
          return a.score - b.score;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [searchQuery, sortBy, statusFilter, riskFilter]);

  const hasActiveFilters = statusFilter !== "all" || riskFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setRiskFilter("all");
  };

  const handleReportClick = (reportId: number) => {
    // Navigate to report - in a real app this would load the specific report
    navigate("/report");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Histórico de Análises</h1>
        <p className="text-muted-foreground">Visualize e gerencie suas análises competitivas anteriores</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar relatórios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={hasActiveFilters ? "border-primary text-primary" : ""}>
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {(statusFilter !== "all" ? 1 : 0) + (riskFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {(Object.keys(statusLabels) as StatusFilter[]).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-primary/10 text-primary" : ""}
              >
                {statusLabels[status]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Nível de Risco</DropdownMenuLabel>
            {(Object.keys(riskLabels) as RiskFilter[]).map((risk) => (
              <DropdownMenuItem
                key={risk}
                onClick={() => setRiskFilter(risk)}
                className={riskFilter === risk ? "bg-primary/10 text-primary" : ""}
              >
                {riskLabels[risk]}
              </DropdownMenuItem>
            ))}
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Limpar filtros
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {sortLabels[sortBy]}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSortBy(option)}
                className={sortBy === option ? "bg-primary/10 text-primary" : ""}
              >
                {sortLabels[option]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
              {statusLabels[statusFilter]}
              <button onClick={() => setStatusFilter("all")} className="hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {riskFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
              {riskLabels[riskFilter]}
              <button onClick={() => setRiskFilter("all")} className="hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedReports.map((report) => (
          <div key={report.id} onClick={() => handleReportClick(report.id)}>
            <ReportCard {...report} />
          </div>
        ))}
      </div>

      {filteredAndSortedReports.length === 0 && (
        <div className="text-center py-12 glass-card">
          <p className="text-muted-foreground">Nenhum relatório encontrado para sua busca.</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Limpar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
