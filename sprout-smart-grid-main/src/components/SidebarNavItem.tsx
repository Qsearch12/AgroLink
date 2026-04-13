import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { type ReactNode } from "react";

interface SidebarNavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export function SidebarNavItem({ to, icon, label }: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterNavLink
      to={to}
      className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
      )}
      <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/40 animate-pulse" />
      )}
    </RouterNavLink>
  );
}
