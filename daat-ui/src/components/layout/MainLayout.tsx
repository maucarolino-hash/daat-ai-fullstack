import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const SIDEBAR_COOKIE_NAME = "sidebar:state";

export function MainLayout({ children }: MainLayoutProps) {
  // Read initial state from cookie
  const defaultOpen = (() => {
    const match = document.cookie.match(new RegExp(`${SIDEBAR_COOKIE_NAME}=([^;]+)`));
    return match ? match[1] === "true" : true;
  })();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <TopNav />
            </div>
          </header>
          <main className="flex-1 p-6 animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
