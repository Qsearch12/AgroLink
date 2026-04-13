import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { farmerNavItems } from "@/constants/navigation";
import { Wheat, User, TrendingUp, MapPin, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cropsApi, messagesApi, recommendationsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCrops: 0,
    activeCrops: 0,
    buyerRequests: 0,
    revenue: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [myCrops, requests, recs] = await Promise.all([
          cropsApi.getMyCrops(),
          messagesApi.getFarmerRequests(),
          recommendationsApi.getFarmerRecommendations().catch(() => []),
        ]);
        
        setRecommendations(recs);
        
        const totalRevenue = requests
          .filter((r: any) => r.status === "accepted" || r.status === "completed")
          .reduce((sum: number, r: any) => sum + (r.quantity * (r.crop_price || 0)), 0);

        setStats({
          totalCrops: myCrops.length,
          activeCrops: myCrops.filter((c: any) => !c.is_sold).length,
          buyerRequests: requests.filter((r: any) => r.status === "pending").length,
          revenue: totalRevenue,
        });

        // Generate dynamic activities
        const newActivities = [];
        
        // Add recent requests
        requests.slice(0, 3).forEach((r: any) => {
          newActivities.push({
            action: "Buyer Request",
            detail: `${r.buyer_name} requested ${r.quantity} units of ${r.crop_name}`,
            time: new Date(r.created_at).toLocaleDateString(),
            type: "request"
          });
        });

        // Add recent crops
        myCrops.slice(0, 2).forEach((c: any) => {
          newActivities.push({
            action: "Crop Listed",
            detail: `Your ${c.name} listing is live at ₦${c.price_per_unit}/${c.unit}`,
            time: new Date(c.created_at).toLocaleDateString(),
            type: "crop"
          });
        });

        setActivities(newActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout navItems={farmerNavItems} title="Farmer Dashboard">
      <div className="space-y-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Crops Listed" 
              value={isLoading ? "..." : stats.totalCrops.toString()} 
              icon={<Wheat className="w-5 h-5" />} 
              change={isLoading ? "" : `${stats.totalCrops} total`} 
              trend="neutral" 
            />
            <StatCard 
              title="Active Listings" 
              value={isLoading ? "..." : stats.activeCrops.toString()} 
              icon={<Wheat className="w-5 h-5" />} 
              change={isLoading ? "" : "Live on market"} 
              trend="up" 
            />
            <StatCard 
              title="New Requests" 
              value={isLoading ? "..." : stats.buyerRequests.toString()} 
              icon={<User className="w-5 h-5" />} 
              change={isLoading ? "" : "Pending approval"} 
              trend="up" 
            />
            <StatCard 
              title="Estimated Revenue" 
              value={isLoading ? "..." : `₦${stats.revenue.toLocaleString()}`} 
              icon={<TrendingUp className="w-5 h-5" />} 
              change={stats.revenue > 0 ? "From accepted requests" : "No sales yet"} 
              trend={stats.revenue > 0 ? "up" : "neutral"} 
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScrollReveal delay={100}>
            <div className="bg-card rounded-xl border p-6 h-full">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="divide-y">
                {activities.length > 0 ? activities.map((item, i) => (
                  <div key={i} className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4">No recent activity found.</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-card rounded-xl border p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Top Buyers for You</h2>
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                  Smart Match
                </span>
              </div>
              <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map((buyer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {buyer.buyer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{buyer.buyer_name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {buyer.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium text-foreground">{buyer.request_count} requests</p>
                        <p className="text-[10px] text-muted-foreground">Historical interest</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-full group-hover:bg-primary group-hover:text-primary-foreground"
                        onClick={() => navigate(`/farmer/messages?userId=${buyer.buyer_id}`)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <User className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No matching buyers found yet.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">We'll suggest buyers as you list more crops.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </DashboardLayout>
  );
}
