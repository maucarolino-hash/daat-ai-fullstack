import { Home, List, BarChart3, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: List, label: "History", path: "/history" },
  { icon: BarChart3, label: "Analysis", path: "/analysis" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-sidebar border-r border-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-neon-blue flex items-center justify-center cyber-glow">
          <span className="text-lg font-bold text-accent-foreground">M</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />
                )}
                {/* Tooltip */}
                <div className="absolute left-14 px-2 py-1 bg-popover border border-border rounded-md text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Avatar */}
      <div className="mt-auto">
        <button className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors duration-200">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}
