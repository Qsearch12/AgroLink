import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buyerNavItems } from "@/constants/navigation";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, MapPin, Package, Calendar, User, Send, TrendingUp, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cropsApi, messagesApi } from "@/lib/api";

type Demand = "high" | "medium" | "low";

const demandConfig: Record<Demand, { label: string; className: string; hint: string }> = {
  high: { label: "High Demand", className: "bg-emerald-100 text-emerald-700 border-emerald-200", hint: "This crop is trending in Lagos and Kano markets" },
  medium: { label: "Medium Demand", className: "bg-amber-100 text-amber-700 border-amber-200", hint: "Steady demand across regional markets" },
  low: { label: "Low Demand", className: "bg-rose-100 text-rose-700 border-rose-200", hint: "Lower demand this season — good negotiation opportunity" },
};

export default function CropDetails() {
  const { id } = useParams();
  const [crop, setCrop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestQty, setRequestQty] = useState("");
  const [requestMsg, setRequestMsg] = useState("");

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        if (id) {
          const data = await cropsApi.getById(id);
          setCrop(data);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch crop details.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handleSendRequest = async () => {
    try {
      await messagesApi.createRequest({
        crop_id: crop.id,
        quantity: parseFloat(requestQty),
        message: requestMsg,
      });
      setRequestSent(true);
      setShowRequestModal(false);
      setRequestQty("");
      setRequestMsg("");
      toast({ title: "Purchase Request Sent", description: "The farmer will be notified and can respond via messages." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send request", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout navItems={buyerNavItems} title="Crop Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading crop details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!crop) {
    return (
      <DashboardLayout navItems={buyerNavItems} title="Crop Not Found">
        <div className="text-center p-12">
          <p className="text-muted-foreground">The crop you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link to="/buyer/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const dm = demandConfig["medium"]; // Default for now

  return (
    <DashboardLayout navItems={buyerNavItems} title="Crop Details">
      <div className="max-w-5xl space-y-6">
        <ScrollReveal>
          <Link to="/buyer/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Left — Image (3 cols) */}
            <div className="md:col-span-3 space-y-4">
              <div className="bg-surface-green rounded-xl border h-72 md:h-96 flex items-center justify-center relative">
                <span className="text-7xl">🌾</span>
                <button
                  onClick={() => setSaved(!saved)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-card/90 hover:bg-card transition-colors active:scale-95"
                >
                  <Heart className={`w-5 h-5 ${saved ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                </button>
              </div>

              {/* Description (below image on desktop) */}
              <div className="bg-card rounded-xl border p-5 space-y-3">
                <h2 className="font-semibold text-foreground">About this crop</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{crop.description}</p>
              </div>
            </div>

            {/* Right — Details (2 cols) */}
            <div className="md:col-span-2 space-y-5">
              {/* Type + Name + Price */}
              <div className="bg-card rounded-xl border p-5 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{crop.category}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${dm.className}`}>
                    <TrendingUp className="w-3 h-3" />
                    {dm.label}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground leading-tight">{crop.name}</h1>
                  <p className="text-2xl font-bold text-primary mt-1">₦{crop.price_per_unit}/{crop.unit}</p>
                </div>
                <p className="text-xs text-muted-foreground">{dm.hint}</p>

                {/* Key details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  {[
                    { icon: <Package className="w-4 h-4" />, label: "Stock", value: `${crop.quantity_available} ${crop.unit}` },
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: crop.location },
                    { icon: <Calendar className="w-4 h-4" />, label: "Date Listed", value: new Date(crop.created_at).toLocaleDateString() },
                    { icon: <TrendingUp className="w-4 h-4" />, label: "Category", value: crop.category },
                  ].map((item) => (
                    <div key={item.label} className="bg-card/50 rounded-lg p-3 border border-border/50 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        {item.icon}
                        {item.label}
                      </div>
                      <div className="font-bold text-foreground truncate">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farmer card */}
              <div className="bg-card rounded-xl border p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Farmer Profile
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {crop.owner_name ? crop.owner_name.split(" ").map((n: string) => n[0]).join("") : "F"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {crop.owner_name || "Farmer"}
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    </p>
                    <p className="text-xs text-muted-foreground">Verified · Member since 2024</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                {requestSent ? (
                  <Button size="lg" className="w-full" disabled>
                    ✓ Purchase Request Sent
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={() => setShowRequestModal(true)}>
                    <Send className="w-4 h-4 mr-2" /> Send Purchase Request
                  </Button>
                )}
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link to={`/buyer/messages?with=${crop.owner_id}`}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Contact Farmer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Purchase Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Purchase Request</DialogTitle>
            <DialogDescription>
              Request to purchase {crop.name} from {crop.owner_name || "the farmer"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Quantity Needed ({crop.unit})</label>
              <Input
                type="number"
                placeholder={`e.g. ${crop.quantity_available / 2}`}
                value={requestQty}
                onChange={(e) => setRequestQty(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message to Farmer</label>
              <Textarea
                placeholder="Describe your requirements, delivery preferences, etc..."
                value={requestMsg}
                onChange={(e) => setRequestMsg(e.target.value)}
                className="mt-1.5"
                rows={3}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Crop:</strong> {crop.name}</p>
              <p><strong className="text-foreground">Available:</strong> {crop.quantity_available} {crop.unit}</p>
              <p><strong className="text-foreground">Price:</strong> ₦{crop.price_per_unit}/{crop.unit}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>Cancel</Button>
            <Button onClick={handleSendRequest} disabled={!requestQty || parseFloat(requestQty) <= 0}>
              <Send className="w-4 h-4 mr-2" /> Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
