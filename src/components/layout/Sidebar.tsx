import { useState } from "react";
import { Home, List, Settings, User, Menu, X, LogOut, Sun, Moon, Eye, Activity, Grid3X3, LayoutDashboard, ChevronsLeft, ChevronsRight } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, label: "Painel", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: List, label: "Histórico", path: "/history" },
  { icon: Eye, label: "Visão Geral", path: "/analysis/overview" },
  { icon: Activity, label: "Simulador", path: "/analysis/simulator" },
  { icon: Grid3X3, label: "Recursos", path: "/analysis/features" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

export function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored ? stored === 'true' : true;
  });
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Falha ao sair");
    } else {
      toast.success("Você saiu com sucesso");
      navigate("/auth");
    }
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={cn(
          "fixed top-4 z-[60] md:hidden transition-all duration-300",
          mobileMenuOpen ? "left-24" : "left-4"
        )}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <TooltipProvider delayDuration={0}>
        <aside className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-border flex flex-col py-6 z-50",
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-[72px]" : "w-60"
        )}>
          {/* Header with Logo and Toggle */}
          <div className={cn(
            "mb-6 flex items-center px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center cyber-glow flex-shrink-0">
                <span className="text-lg font-bold text-accent-foreground">M</span>
              </div>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                isCollapsed ? "w-0 opacity-0" : "w-[100px] opacity-100"
              )}>
                <span className="text-lg font-semibold text-foreground whitespace-nowrap block">
                  Maverick
                </span>
              </div>
            </div>

            {/* Toggle Button - Only visible on desktop when expanded */}
            <button
              onClick={toggleSidebar}
              className={cn(
                "hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 flex-shrink-0",
                "transition-all duration-200",
                isCollapsed && "absolute -right-3 top-8 bg-sidebar border border-border shadow-md"
              )}
              aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {isCollapsed ? (
                <ChevronsRight className="w-4 h-4" />
              ) : (
                <ChevronsLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              const linkContent = (
                <NavLink
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg relative group",
                    "transition-all duration-200",
                    isCollapsed ? "w-12 h-12 justify-center mx-auto" : "h-11 px-3",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <span className="text-sm font-medium whitespace-nowrap block">
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />
                  )}
                </NavLink>
              );

              return isCollapsed ? (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.path}>{linkContent}</div>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          {(() => {
            const themeButton = (
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 mb-2",
                  "transition-all duration-200",
                  isCollapsed ? "w-12 h-12 justify-center mx-auto" : "h-11 px-3 w-full"
                )}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Moon className="w-5 h-5 flex-shrink-0" />
                )}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  <span className="text-sm font-medium whitespace-nowrap block">
                    {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                  </span>
                </div>
              </button>
            );

            return (
              <div className="px-3">
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {themeButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      <p>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : themeButton}
              </div>
            );
          })()}

          {/* User Avatar with Dropdown */}
          <div className="mt-auto px-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center gap-3 rounded-lg border border-border hover:border-primary/50",
                  "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                  isCollapsed ? "w-12 h-12 justify-center mx-auto" : "h-12 px-3 w-full bg-secondary/30"
                )}>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                        {user?.email || "Usuário"}
                      </span>
                      <span className="text-xs text-muted-foreground">Conta</span>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email || "Usuário"}
                  </p>
                  <p className="text-xs text-muted-foreground">Conta</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      </TooltipProvider>
    </>
  );
}
