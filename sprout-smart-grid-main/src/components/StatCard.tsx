import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export function StatCard({ title, value, change, trend = "neutral", icon }: StatCardProps) {
  return (
    <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden group">
      {/* Background Accent */}
      <div className={`absolute -bottom-12 -right-12 w-32 h-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${
        trend === "up" ? "bg-emerald-500" : trend === "down" ? "bg-rose-500" : "bg-primary"
      }`} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${
          trend === "up" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : 
          trend === "down" ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : 
          "text-muted-foreground border-border/50 bg-muted/20"
        }`}>
          {trend === "up" ? "High" : trend === "down" ? "Low" : "Stable"}
        </div>
      </div>
      
      <div className="space-y-1 relative z-10">
        <div className="text-sm font-bold text-muted-foreground/80 tracking-tight">{title}</div>
        <div className="text-3xl font-black text-foreground tabular-nums tracking-tighter group-hover:scale-[1.02] transition-transform origin-left duration-300">{value}</div>
        {change && (
          <div className={`flex items-center gap-2 mt-2 text-[11px] font-bold uppercase tracking-widest ${
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
          }`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-lg ${
              trend === "up" ? "bg-emerald-500/10" : trend === "down" ? "bg-rose-500/10" : "bg-muted/20"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"}
            </span>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
