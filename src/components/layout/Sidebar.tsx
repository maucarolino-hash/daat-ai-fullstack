import { useState } from "react";
import { Home, List, BarChart3, Settings, User, Menu, X, LogOut, Sun, Moon, Eye, Activity, Grid3X3, ChevronDown } from "lucide-react";
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
  { icon: List, label: "Histórico", path: "/history" },
  { 
    icon: BarChart3, 
    label: "Análise", 
    path: "/analysis",
    subItems: [
      { icon: Eye, label: "Visão Geral", path: "/analysis/overview" },
      { icon: Activity, label: "Simulador", path: "/analysis/simulator" },
      { icon: Grid3X3, label: "Recursos", path: "/analysis/features" },
    ]
  },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const isAnalysisActive = location.pathname.startsWith("/analysis");

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
        "fixed left-0 top-0 h-screen w-20 bg-sidebar border-r border-border flex flex-col items-center py-6 z-50 transition-transform duration-300",
        "md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center cyber-glow">
            <span className="text-xl font-bold text-accent-foreground">M</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const hasSubItems = 'subItems' in item && item.subItems;
            const isActive = item.path === "/analysis" 
              ? isAnalysisActive 
              : location.pathname === item.path;

            if (hasSubItems) {
              return (
                <div key={item.path} className="relative group">
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 relative",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    {isActive && (
                      <div className="absolute left-0 w-0.5 h-7 bg-primary rounded-r-full" />
                    )}
                  </NavLink>
                  
                  {/* Sub-menu flyout */}
                  <div className="absolute left-16 top-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
                      <div className="text-sm font-semibold text-foreground px-3 py-2 border-b border-border mb-1">
                        {item.label}
                      </div>
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive: subActive }) =>
                            cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                              subActive
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )
                          }
                        >
                          <subItem.icon className="w-4 h-4" />
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <div className="absolute left-0 w-0.5 h-7 bg-primary rounded-r-full" />
                )}
                {/* Tooltip */}
                <div className="absolute left-16 px-2 py-1 bg-popover border border-border rounded-md text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary group mb-2"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Avatar with Dropdown */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors duration-200">
                <User className="w-5 h-5 text-muted-foreground" />
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
