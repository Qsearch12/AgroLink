import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CropCard } from "@/components/CropCard";
import { buyerNavItems } from "@/constants/navigation";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { cropsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function SavedCrops() {
  const [crops, setCrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await cropsApi.getSavedCrops();
        setCrops(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch saved crops.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (isLoading && crops.length === 0) {
    return (
      <DashboardLayout navItems={buyerNavItems} title="Saved Crops">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading saved crops...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={buyerNavItems} title="Saved Crops">
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your Saved Listings</h2>
            <p className="text-sm text-muted-foreground">{crops.length} crops bookmarked</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          {crops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {crops.map((crop) => (
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
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border">
              <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No saved crops yet</p>
              <p className="text-sm text-muted-foreground mt-1">Browse the marketplace and save listings you're interested in</p>
              <Button asChild className="mt-4">
                <Link to="/buyer/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
