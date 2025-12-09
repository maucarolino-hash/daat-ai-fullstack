import { useState } from "react";
import { Home, List, Settings, User, Menu, X, LogOut, Sun, Moon, Eye, Activity, Grid3X3, LayoutDashboard, PanelLeftClose, PanelLeft } from "lucide-react";
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
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-border flex flex-col py-6 z-50",
        "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "w-20 items-center" : "w-56 px-3"
      )}>
        {/* Logo and Toggle */}
        <div className={cn(
          "mb-6 flex items-center",
          isCollapsed ? "justify-center" : "justify-between px-2"
        )}>
          <div className={cn(
            "rounded-xl bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center cyber-glow",
            isCollapsed ? "w-12 h-12" : "w-10 h-10"
          )}>
            <span className={cn("font-bold text-accent-foreground", isCollapsed ? "text-xl" : "text-lg")}>M</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">Maverick</span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary mb-4",
            isCollapsed ? "mx-auto" : "ml-auto mr-2"
          )}
        >
          {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        {/* Navigation */}
        <nav className={cn("flex-1 flex flex-col gap-1", isCollapsed ? "" : "w-full")}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <TooltipProvider key={item.path} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg relative overflow-hidden",
                        "transition-all duration-200 ease-out",
                        isCollapsed ? "w-12 h-12 justify-center" : "h-11 px-3",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200" />
                      <span 
                        className={cn(
                          "text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out",
                          isCollapsed ? "opacity-0 w-0 -translate-x-2" : "opacity-100 w-auto translate-x-0"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary mb-2 overflow-hidden",
                  "transition-all duration-200 ease-out",
                  isCollapsed ? "w-12 h-12 justify-center" : "h-11 px-3 w-full"
                )}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 flex-shrink-0 transition-transform duration-200" />
                ) : (
                  <Moon className="w-5 h-5 flex-shrink-0 transition-transform duration-200" />
                )}
                <span 
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out",
                    isCollapsed ? "opacity-0 w-0 -translate-x-2" : "opacity-100 w-auto translate-x-0"
                  )}
                >
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </span>
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* User Avatar with Dropdown */}
        <div className={cn("mt-auto", isCollapsed ? "" : "w-full")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200",
                isCollapsed ? "w-12 h-12 justify-center" : "h-12 px-3 w-full bg-secondary/50"
              )}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                      {user?.email || "Usuário"}
                    </span>
                    <span className="text-xs text-muted-foreground">Conta</span>
                  </div>
                )}
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
    </>
  );
}
