import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { adminNavItems } from "@/constants/navigation";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getRecentUsers(5)
        ]);
        setStats(statsData);
        setRecentUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout navItems={adminNavItems} title="Admin Dashboard">
      <div className="space-y-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={isLoading ? "..." : stats?.users.toString()} 
              icon={<Users className="w-5 h-5" />} 
              change={isLoading ? "" : "+12 this month"} 
              trend="up" 
            />
            <StatCard 
              title="Farmers" 
              value={isLoading ? "..." : stats?.farmers.toString()} 
              change={isLoading ? "" : "Verified listings"} 
              trend="up" 
            />
            <StatCard 
              title="Buyers" 
              value={isLoading ? "..." : stats?.buyers.toString()} 
              change={isLoading ? "" : "Active profiles"} 
              trend="up" 
            />
            <StatCard 
              title="Active Listings" 
              value={isLoading ? "..." : stats?.active_listings.toString()} 
              change={isLoading ? "" : "Live on platform"} 
              trend="up" 
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Users</h2>
              <span className="text-xs text-muted-foreground">Showing latest 5</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Listings</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{u.full_name}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.role === "farmer" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
                        }`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs font-medium ${
                          u.is_verified ? "text-stat-up" : "text-accent"
                        }`}>{u.is_verified ? "Verified" : "Pending"}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="p-3 tabular-nums text-foreground">{u.username}</td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No recent users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
