import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { WizardModal } from "@/components/wizard/WizardModal";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-16">
        <TopNav onGenerateReport={() => setWizardOpen(true)} />
        <main className="p-6 animate-fade-in">
          {children}
        </main>
      </div>
      <WizardModal open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
