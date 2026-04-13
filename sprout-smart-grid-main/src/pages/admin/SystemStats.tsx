import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { adminNavItems } from "@/constants/navigation";
import { Users, Wheat, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

const weeklyActivity = [
  { day: "Mon", users: 142, listings: 38, transactions: 12 },
  { day: "Tue", users: 167, listings: 45, transactions: 18 },
  { day: "Wed", users: 134, listings: 32, transactions: 9 },
  { day: "Thu", users: 189, listings: 52, transactions: 21 },
  { day: "Fri", users: 201, listings: 48, transactions: 25 },
  { day: "Sat", users: 98, listings: 21, transactions: 8 },
  { day: "Sun", users: 76, listings: 15, transactions: 5 },
];

const topRegions = [
  { region: "Lagos", users: 1240, listings: 3420, revenue: "₦482M" },
  { region: "Kano", users: 890, listings: 2810, revenue: "₦367M" },
  { region: "Kaduna", users: 720, listings: 2340, revenue: "₦298M" },
  { region: "Oyo", users: 510, listings: 1680, revenue: "₦195M" },
  { region: "Rivers", users: 430, listings: 1290, revenue: "₦164M" },
];

export default function SystemStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch system stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxUsers = Math.max(...weeklyActivity.map((d) => d.users));

  return (
    <DashboardLayout navItems={adminNavItems} title="System Stats">
      <div className="space-y-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={isLoading ? "..." : stats?.users.toString()} 
              icon={<Users className="w-5 h-5" />} 
              change={isLoading ? "" : `${stats?.farmers} farmers, ${stats?.buyers} buyers`} 
              trend="up" 
            />
            <StatCard 
              title="Active Listings" 
              value={isLoading ? "..." : stats?.active_listings.toString()} 
              icon={<Wheat className="w-5 h-5" />} 
              change={isLoading ? "" : `of ${stats?.crops} total crops`} 
              trend="up" 
            />
            <StatCard 
              title="Purchase Requests" 
              value={isLoading ? "..." : stats?.total_requests.toString()} 
              icon={<TrendingUp className="w-5 h-5" />} 
              change="+12% this month" 
              trend="up" 
            />
            <StatCard 
              title="Platform Activity" 
              value="Live" 
              icon={<Activity className="w-5 h-5" />} 
              change="Systems operational" 
              trend="neutral" 
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Activity</h2>
            <div className="flex items-end gap-3 h-40">
              {weeklyActivity.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-md relative group cursor-default"
                    style={{ height: `${(d.users / maxUsers) * 100}%`, minHeight: "8px" }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-300"
                      style={{ height: `${(d.listings / d.users) * 100}%`, minHeight: "4px" }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.users} users
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary/20" /> Signups</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> Listings</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-foreground">Top Regions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Region</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Users</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Listings</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topRegions.map((r) => (
                    <tr key={r.region} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{r.region}</td>
                      <td className="p-3 tabular-nums text-foreground">{r.users.toLocaleString()}</td>
                      <td className="p-3 tabular-nums text-foreground">{r.listings.toLocaleString()}</td>
                      <td className="p-3 tabular-nums font-medium text-foreground">{r.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
