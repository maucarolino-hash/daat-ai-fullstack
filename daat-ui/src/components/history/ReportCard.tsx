import { Calendar, TrendingUp, AlertCircle, Loader2, MoreHorizontal, Pencil, Trash2, FolderInput, Copy, Settings, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ReportCardProps {
  id: number;
  title: string;
  date: string;
  status: "complete" | "failed" | "processing";
  score: number;
  riskLevel: "low" | "medium" | "high";
  onAction: (action: string, id: number) => void;
}

export function ReportCard({ id, title, date, status, score, riskLevel, onAction }: ReportCardProps) {
  const statusConfig = {
    complete: { label: "Concluído", color: "bg-primary/20 text-primary border-primary/30" },
    failed: { label: "Falhou", color: "bg-destructive/20 text-destructive border-destructive/30" },
    processing: { label: "Processando", color: "bg-accent/20 text-accent border-accent/30" },
  };

  const riskConfig = {
    low: { label: "Risco Baixo", color: "text-primary" },
    medium: { label: "Risco Médio", color: "text-neon-orange" },
    high: { label: "Risco Alto", color: "text-destructive" },
  };

  const handleMenuClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation(); // Prevent card navigation
    onAction(action, id);
  };

  return (
    <div className="glass-card-hover p-5 cursor-pointer group relative">
      <div className="flex items-start justify-between mb-3">
        <h3
          className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-8"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5",
              statusConfig[status].color
            )}
          >
            {status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
            {statusConfig[status].label}
          </span>

          {/* Context Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem onClick={(e) => handleMenuClick(e, 'select')}>
                <CheckSquare className="w-4 h-4 mr-2" /> Select
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => handleMenuClick(e, 'move')}>
                <FolderInput className="w-4 h-4 mr-2" /> Move to folder
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => handleMenuClick(e, 'remix')}>
                <Copy className="w-4 h-4 mr-2" /> Remix (Duplicate)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => handleMenuClick(e, 'rename')}>
                <Pencil className="w-4 h-4 mr-2" /> Rename
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => handleMenuClick(e, 'settings')}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => handleMenuClick(e, 'delete')}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Pontuação: <span className="text-foreground">{score}</span>/100</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertCircle className={cn("w-4 h-4", riskConfig[riskLevel].color)} />
          <span className={cn("text-sm font-medium", riskConfig[riskLevel].color)}>
            {riskConfig[riskLevel].label}
          </span>
        </div>
      </div>
    </div>
  );
}
