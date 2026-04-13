import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { CropCard } from "@/components/CropCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { buyerNavItems } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cropsApi, messagesApi, recommendationsApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function BuyerDashboard() {
  const [recentCrops, setRecentCrops] = useState<any[]>([]);
  const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);
  const [stats, setStats] = useState({
    available: 0,
    saved: 0,
    requests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [allCrops, saved, requests, recs] = await Promise.all([
          cropsApi.getAll(),
          cropsApi.getSavedCrops().catch(() => []),
          messagesApi.getBuyerRequests().catch(() => []),
          recommendationsApi.getBuyerRecommendations().catch(() => []),
        ]);
        
        setRecentCrops(allCrops.slice(0, 6));
        setRecommendedCrops(recs.slice(0, 3));
        setStats({
          available: allCrops.length,
          saved: saved.length,
          requests: requests.length,
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch dashboard data." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout navItems={buyerNavItems} title="Buyer Dashboard">
      <div className="space-y-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              title="Available Crops" 
              value={isLoading ? "..." : stats.available.toString()} 
              change={isLoading ? "" : "+12 new today"} 
              trend="up" 
            />
            <StatCard 
              title="Saved Listings" 
              value={isLoading ? "..." : stats.saved.toString()} 
              change={stats.saved > 0 ? "Tracked items" : "No saved items"}
            />
            <StatCard 
              title="Active Requests" 
              value={isLoading ? "..." : stats.requests.toString()} 
              change={stats.requests > 0 ? "Pending farmer response" : "No active requests"} 
              trend="neutral" 
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/buyer/marketplace">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCrops.length > 0 ? recommendedCrops.map((crop) => (
                <Link key={crop.crop_id} to={`/buyer/crop/${crop.crop_id}`}>
                  <CropCard
                    id={crop.crop_id}
                    name={crop.crop_name}
                    price={crop.price}
                    quantity={crop.quantity || 1}
                    unit={crop.unit}
                    location={crop.location}
                    farmer={crop.farmer_name}
                    category={crop.category || "Crops"}
                    description={crop.description || ""}
                    is_sold={false}
                    is_verified={crop.is_verified ?? true}
                    created_at={new Date().toISOString()}
                  />
                </Link>
              )) : (
                recentCrops.slice(0, 3).map((crop) => (
                  <Link key={crop.id} to={`/buyer/crop/${crop.id}`}>
                    <CropCard
                      id={crop.id}
                      name={crop.name}
                      price={crop.price_per_unit}
                      quantity={crop.quantity_available}
                      unit={crop.unit}
                      location={crop.location}
                      farmer={crop.owner_name}
                      category={crop.category}
                      description={crop.description}
                      is_sold={crop.is_sold}
                      is_verified={crop.is_owner_verified}
                      created_at={crop.created_at}
                    />
                  </Link>
                ))
              )}
              {!isLoading && recentCrops.length === 0 && recommendedCrops.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full py-8 text-center bg-muted/30 rounded-lg">No crops available at the moment.</p>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Listings</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/buyer/marketplace">Browse <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCrops.slice(3, 6).map((crop) => (
                <Link key={crop.id} to={`/buyer/crop/${crop.id}`}>
                  <CropCard
                    id={crop.id}
                    name={crop.name}
                    price={crop.price_per_unit}
                    quantity={crop.quantity_available}
                    unit={crop.unit}
                    location={crop.location}
                    farmer={crop.owner_name}
                    category={crop.category}
                    description={crop.description}
                    is_sold={crop.is_sold}
                    is_verified={crop.is_owner_verified}
                    created_at={crop.created_at}
                  />
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
