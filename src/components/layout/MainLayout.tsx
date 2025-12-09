import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface MainLayoutProps {
  children: ReactNode;
}

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored ? stored === 'true' : true;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setIsCollapsed(stored ? stored === 'true' : true);
    };
    
    window.addEventListener('storage', handleStorage);
    
    // Also listen for custom event for same-tab updates
    const handleSidebarChange = () => handleStorage();
    window.addEventListener('sidebar-change', handleSidebarChange);
    
    // Poll for changes (backup for same-tab)
    const interval = setInterval(handleStorage, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sidebar-change', handleSidebarChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '5rem' : '14rem' }}
      >
        <TopNav />
        <main className="p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
