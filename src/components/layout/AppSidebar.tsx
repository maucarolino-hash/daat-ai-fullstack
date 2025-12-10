import { Home, List, Settings, User, LogOut, Sun, Moon, Eye, Activity, Grid3X3, LayoutDashboard } from "lucide-react";
import { NavLink as RouterNavLink, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: Home, label: "Painel", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: List, label: "Histórico", path: "/history" },
  { icon: Eye, label: "Visão Geral", path: "/analysis/overview" },
  { icon: Activity, label: "Simulador", path: "/analysis/simulator" },
  { icon: Grid3X3, label: "Recursos", path: "/analysis/features" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Falha ao sair");
    } else {
      toast.success("Você saiu com sucesso");
      navigate("/auth");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center overflow-hidden">
          {/* Logo container with animated text */}
          <div className="flex items-center">
            {/* D letter - always visible */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center flex-shrink-0 z-10 relative">
              <span className="text-base font-bold text-accent-foreground">D</span>
            </div>
            
            {/* "aat IA" slides out from behind */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
              "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0",
              "group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100"
            )}>
              <span className={cn(
                "text-lg font-bold text-sidebar-foreground whitespace-nowrap pl-0.5",
                "transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                "group-data-[collapsible=icon]:translate-x-[-100%]",
                "group-data-[state=expanded]:translate-x-0"
              )}>
                aat <span className="text-neon-blue">IA</span>
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "relative",
                        isActive && "bg-sidebar-primary/15 text-sidebar-primary"
                      )}
                    >
                      <RouterNavLink to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="absolute left-0 w-0.5 h-5 bg-sidebar-primary rounded-r-full" />
                        )}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  tooltip={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={user?.email || "Usuário"}
                >
                  <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-sidebar-accent-foreground" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      {user?.email?.split('@')[0] || "Usuário"}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user?.email || "conta@email.com"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for hover-to-expand */}
      <SidebarRail />
    </Sidebar>
  );
}
