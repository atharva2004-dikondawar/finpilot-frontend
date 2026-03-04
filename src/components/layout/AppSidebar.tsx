import {
  LayoutDashboard,
  BarChart3,
  Sliders,
  Target,
  ShieldAlert,
  FileText,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Financials", url: "/financials", icon: BarChart3 },
  { title: "Strategy Simulator", url: "/simulator", icon: Sliders },
  { title: "Optimizer", url: "/optimizer", icon: Target },
  { title: "Risk Intelligence", url: "/risk", icon: ShieldAlert },
  { title: "Executive Report", url: "/report", icon: FileText },
  { title: "Data Entry", url: "/data-entry", icon: PlusCircle },
  { title: "Ask CFO", url: "/ask-cfo", icon: MessageSquare },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground whitespace-nowrap">
              FinPilot AI
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? ""
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              }`}
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
