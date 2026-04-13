import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { farmerNavItems } from "@/constants/navigation";
import { Check, X, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { messagesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function BuyerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const data = await messagesApi.getFarmerRequests();
      setRequests(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch buyer requests.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await messagesApi.updateRequestStatus(id, status);
      toast({ title: "Success", description: `Request ${status} successfully.` });
      fetchRequests();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update status", variant: "destructive" });
    }
  };

  if (isLoading && requests.length === 0) {
    return (
      <DashboardLayout navItems={farmerNavItems} title="Buyer Requests">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={farmerNavItems} title="Buyer Requests">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Pending</div>
              <div className="text-2xl font-bold text-foreground tabular-nums">{requests.filter(r => r.status === "pending").length}</div>
            </div>
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Accepted</div>
              <div className="text-2xl font-bold text-stat-up tabular-nums">{requests.filter(r => r.status === "accepted").length}</div>
            </div>
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Declined</div>
              <div className="text-2xl font-bold text-muted-foreground tabular-nums">{requests.filter(r => r.status === "rejected").length}</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                      {req.buyer_name ? req.buyer_name.split(" ").map((n: string) => n[0]).join("") : "B"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{req.buyer_name || "Buyer"}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          req.status === "pending" ? "bg-accent/20 text-accent-foreground" :
                          req.status === "accepted" ? "bg-stat-up/10 text-stat-up" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Wants <span className="font-medium text-foreground">{req.quantity} units</span> of{" "}
                        <span className="font-medium text-foreground">{req.crop_name}</span>
                      </p>
                      {req.message && <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">"{req.message}"</p>}
                      <span className="text-xs text-muted-foreground mt-2 block">{new Date(req.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {req.status === "pending" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-stat-up border-stat-up/30 hover:bg-stat-up/10"
                        onClick={() => handleStatusUpdate(req.id, "accepted")}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleStatusUpdate(req.id, "rejected")}
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/farmer/messages?with=${req.buyer_id}`}>
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                        req.status === "accepted" 
                          ? "text-stat-up border-stat-up/20 bg-stat-up/5" 
                          : "text-destructive border-destructive/20 bg-destructive/5"
                      }`}>
                        {req.status}
                      </span>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/farmer/messages?with=${req.buyer_id}`}>
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Chat
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <p className="text-muted-foreground">No purchase requests yet.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
