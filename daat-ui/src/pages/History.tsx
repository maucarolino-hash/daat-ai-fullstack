import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/services/api";

// Types matching Backend Data
interface HistoryItem {
  id: number;
  title: string; // derived from customer_segment
  date: string;  // derived from created_at
  status: "complete" | "processing" | "failed";
  score: number;
  riskLevel: "low" | "medium" | "high";
}

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
  const [reports, setReports] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  // Rename State
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [reportToRename, setReportToRename] = useState<{ id: number, title: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/history/');

        // Map Backend Data to Frontend Model
        const mappedReports: HistoryItem[] = response.data.history.map((item: any) => {
          // Status Logic
          let status: "complete" | "processing" | "failed" = "complete";
          if (item.feedback && item.feedback.startsWith("Processando")) status = "processing";
          if (item.score === 0 && status !== "processing") status = "failed"; // Assume failed if 0 score and not processing

          // Risk Logic
          let risk: "low" | "medium" | "high" = "medium";
          if (item.score >= 70) risk = "low";
          else if (item.score <= 40) risk = "high";

          return {
            id: item.id,
            title: item.customer_segment || "Análise Sem Título",
            date: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: status,
            score: item.score,
            riskLevel: risk,
          };
        });

        if (response.data.debug_user) {
          toast.info(`Debug: Conectado como ${response.data.debug_user} (ID: ${response.data.debug_id}). Itens: ${mappedReports.length}`);
        }

        setReports(mappedReports);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
          return b.id - a.id;
        case "date-asc":
          return a.id - b.id;
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
  }, [reports, searchQuery, sortBy, statusFilter, riskFilter]);

  const hasActiveFilters = statusFilter !== "all" || riskFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setRiskFilter("all");
  };

  const handleReportClick = (reportId: number) => {
    navigate(`/report?id=db_task_${reportId}`);
  };

  const handleAction = async (action: string, id: number) => {
    if (action === 'delete') {
      if (window.confirm("Tem certeza que deseja excluir esta análise?")) {
        try {
          await api.delete(`/api/history/${id}/`); // Correct RESTful URL
          setReports(prev => prev.filter(r => r.id !== id));
        } catch (error) {
          console.error("Erro ao deletar:", error);
          alert("Erro ao excluir análise.");
        }
      }
    } else if (action === 'rename') {
      const report = reports.find(r => r.id === id);
      if (report) {
        setReportToRename({ id, title: report.title });
        setNewTitle(report.title);
        setIsRenameOpen(true);
      }
    } else {
      // Placeholder for Move/Select/Remix
      alert(`Funcionalidade '${action}' em breve!`);
    }
  };

  const submitRename = async () => {
    if (!reportToRename || !newTitle.trim()) return;

    try {
      setIsRenaming(true);
      await api.patch(`/api/history/${reportToRename.id}/rename/`, {
        new_title: newTitle
      });

      // Update local state
      setReports(prev => prev.map(r =>
        r.id === reportToRename.id ? { ...r, title: newTitle } : r
      ));
      setIsRenameOpen(false);
    } catch (error) {
      console.error("Erro ao renomear:", error);
      alert("Erro ao renomear análise.");
    } finally {
      setIsRenaming(false);
    }
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
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedReports.map((report) => (
            <div key={report.id} onClick={() => handleReportClick(report.id)}>
              <ReportCard
                {...report}
                onAction={handleAction}
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredAndSortedReports.length === 0 && (
        <div className="text-center py-12 glass-card">
          <p className="text-muted-foreground">Nenhum relatório encontrado para sua busca.</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renomear Análise</DialogTitle>
            <DialogDescription>
              Digite um novo nome para identificar esta análise facilmente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancelar</Button>
            <Button onClick={submitRename} disabled={isRenaming}>
              {isRenaming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
