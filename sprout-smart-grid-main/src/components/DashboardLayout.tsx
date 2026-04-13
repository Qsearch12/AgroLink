import { type ReactNode, useState } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

interface NavItem {
  to: string;
  icon: ReactNode;
  label: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

export function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border/50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-foreground tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              🌿
            </div>
            AgroLink
          </Link>
          <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Menu</div>
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border/50 bg-muted/20 space-y-2">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10 mb-2">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Support</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Need help with your farm? Our experts are here.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
          <Link to="/" className="flex items-center gap-2 px-4 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-all group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="sticky top-0 z-30 bg-background/60 backdrop-blur-md border-b border-border/50 h-16 flex items-center px-4 lg:px-8 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-muted/50 hover:bg-muted mr-4 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="hidden sm:block text-[11px] text-muted-foreground font-medium">Welcome back to AgroLink Nigeria</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="h-8 w-[1px] bg-border/50 mx-2 hidden sm:block" />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-10 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
