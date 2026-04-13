import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buyerNavItems } from "@/constants/navigation";
import { Search, Heart, Eye, MessageCircle, Send, MapPin, Package, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cropsApi, messagesApi } from "@/lib/api";

type Demand = "high" | "medium" | "low";

const demandConfig: Record<Demand, { label: string; className: string }> = {
  high: { label: "High Demand", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium Demand", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "Low Demand", className: "bg-rose-100 text-rose-700 border-rose-200" },
};

const cropTypes = ["All", "Grains", "Tubers", "Fruits", "Cash Crops"];

export default function BuyerMarketplace() {
  const [crops, setCrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [requestedIds, setRequestedIds] = useState<number[]>([]);
  const [requestModal, setRequestModal] = useState<any | null>(null);
  const [requestQty, setRequestQty] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allCrops, saved] = await Promise.all([
          cropsApi.getAll(),
          cropsApi.getSavedCrops().catch(() => [])
        ]);
        setCrops(allCrops);
        setSavedIds(saved.map((s: any) => s.id));
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch marketplace data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = crops.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          (c.owner_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || c.category === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleSave = async (id: number) => {
    try {
      const result = await cropsApi.toggleSave(id);
      if (result.saved) {
        setSavedIds((prev) => [...prev, id]);
        toast({ title: "Saved", description: "Crop added to your saved listings." });
      } else {
        setSavedIds((prev) => prev.filter((i) => i !== id));
        toast({ title: "Removed", description: "Crop removed from your saved listings." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update saved status.", variant: "destructive" });
    }
  };

  const handleSendRequest = async () => {
    if (!requestModal) return;
    setIsSending(true);
    try {
      await messagesApi.createRequest({
        crop_id: requestModal.id,
        quantity: parseFloat(requestQty),
        message: requestMsg,
      });
      setRequestedIds((prev) => [...prev, requestModal.id]);
      setRequestModal(null);
      setRequestQty("");
      setRequestMsg("");
      toast({ title: "Request Sent", description: "The farmer will be notified of your purchase request." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send request", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout navItems={buyerNavItems} title="Marketplace">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={buyerNavItems} title="Marketplace">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crops or farmers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {cropTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <p className="text-sm text-muted-foreground">{filtered.length} listings available</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {filtered.map((crop) => {
              const isRequested = requestedIds.includes(crop.id);
              const dm = demandConfig["medium"]; // Default for now
              const priceStr = `₦${crop.price_per_unit}/${crop.unit}`;
              const farmerName = crop.owner_name || "Unknown Farmer";
              return (
                <div key={crop.id} className="bg-card rounded-xl border overflow-hidden shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04),0_1px_2px_-1px_hsl(var(--foreground)/0.04)] hover:shadow-[0_4px_12px_0_hsl(var(--foreground)/0.08)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 group">
                  {/* Image area */}
                  <div className="h-36 bg-surface-green flex items-center justify-center relative">
                    <span className="text-4xl">🌾</span>
                    <button
                      onClick={() => toggleSave(crop.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-card/90 hover:bg-card transition-colors active:scale-95"
                    >
                      <Heart className={`w-4 h-4 ${savedIds.includes(crop.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                    </button>
                    <span className="absolute bottom-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full bg-card/90 text-muted-foreground">
                      {new Date(crop.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-foreground leading-tight truncate text-base">{crop.name}</h3>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-1.5 py-0.5 rounded w-fit mt-1">{crop.category}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-primary font-bold text-base leading-none">{priceStr}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">per {crop.unit}</p>
                      </div>
                    </div>

                    {/* Description - Shortened */}
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {crop.description || "Fresh produce directly from the farm. Quality guaranteed."}
                    </p>

                    {/* Meta info */}
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-y-2 pt-1 border-t">
                      <p className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Package className="w-3.5 h-3.5 text-primary/60" /> 
                        {crop.quantity_available} {crop.unit}
                      </p>
                      <p className="flex items-center gap-1.5 font-medium text-foreground/80 justify-end">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" /> 
                        <span className="truncate max-w-[80px]">{crop.location}</span>
                      </p>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold shrink-0">
                          {farmerName.charAt(0)}
                        </div>
                        <span className="truncate font-medium text-foreground/70">{farmerName}</span>
                        {crop.is_owner_verified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10" />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1 h-9" asChild>
                        <Link to={`/buyer/crop/${crop.id}`}>
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
                        </Link>
                      </Button>
                      {isRequested ? (
                        <Button size="sm" variant="ghost" disabled className="flex-1 h-9 text-stat-up bg-stat-up/10">
                          ✓ Requested
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1 h-9" onClick={() => setRequestModal(crop)}>
                          <Send className="w-3.5 h-3.5 mr-1.5" /> Request
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No crops found matching your search. Try different filters.
            </div>
          )}
        </ScrollReveal>
      </div>

      {/* Request Modal */}
      <Dialog open={!!requestModal} onOpenChange={() => setRequestModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Purchase Request</DialogTitle>
            <DialogDescription>
              Request to purchase {requestModal?.name} from {requestModal?.owner_name || "the farmer"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Quantity Needed ({requestModal?.unit})</label>
              <Input
                type="number"
                placeholder={`e.g. ${requestModal?.quantity_available / 2}`}
                value={requestQty}
                onChange={(e) => setRequestQty(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message to Farmer</label>
              <Textarea
                placeholder="Introduce yourself and describe your requirements..."
                value={requestMsg}
                onChange={(e) => setRequestMsg(e.target.value)}
                className="mt-1.5"
                rows={3}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Crop:</strong> {requestModal?.name}</p>
              <p><strong className="text-foreground">Available:</strong> {requestModal?.quantity_available} {requestModal?.unit}</p>
              <p><strong className="text-foreground">Price:</strong> ₦{requestModal?.price_per_unit}/{requestModal?.unit}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestModal(null)}>Cancel</Button>
            <Button onClick={handleSendRequest} disabled={!requestQty || isSending}>
              {isSending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
