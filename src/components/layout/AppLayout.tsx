import { AppSidebar } from "./AppSidebar";
import { RefreshCw, User } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  companyName?: string;
}

export function AppLayout({ children, companyName = "Acme Corp" }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{companyName}</span>
            <span className="text-xs text-muted-foreground/50">•</span>
            <span className="text-xs text-muted-foreground">Q4 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
