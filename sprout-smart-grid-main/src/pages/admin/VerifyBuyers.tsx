import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/constants/navigation";
import { Check, X, User as UserIcon, Building, MapPin, Phone, FileText, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function VerifyBuyers() {
  const [users, setUsers] = useState<any[]>([]);
  const [roleType, setRoleType] = useState<"farmer" | "buyer">("buyer");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log(`Starting to fetch unverified ${roleType}s...`);
    try {
      const data = roleType === "buyer" 
        ? await adminApi.getUnverifiedBuyers() 
        : await adminApi.getUnverifiedFarmers();
      console.log(`Successfully fetched ${data.length} users.`);
      setUsers(data);
    } catch (error: any) {
      console.error("Fetch users error:", error);
      toast({
        title: "Error fetching users",
        description: error.message || "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleType]);

  const handleVerify = async (userId: number) => {
    try {
      if (roleType === "buyer") {
        await adminApi.verifyBuyer(userId);
      } else {
        await adminApi.verifyFarmer(userId);
      }
      toast({
        title: "User verified",
        description: `Successfully verified the ${roleType}.`,
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems} title="User Verification">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border bg-muted/50 p-1">
                {(["buyer", "farmer"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleType(r)}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      roleType === r
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "buyer" ? "🛒 Buyers" : "👨‍🌾 Farmers"}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchUsers} 
                disabled={isLoading}
                className={`rounded-full transition-all ${isLoading ? "animate-spin" : "hover:rotate-180 duration-500"}`}
              >
                <RefreshCw className="w-4 h-4 text-primary" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="bg-card rounded-lg border p-4">
                <div className="text-xs text-muted-foreground mb-1">Pending</div>
                <div className="text-xl font-bold text-foreground tabular-nums">{users.length}</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-xs text-muted-foreground mb-1">Total Verified</div>
                <div className="text-xl font-bold text-stat-up tabular-nums">42</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Fetching unverified {roleType}s...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-card rounded-2xl border border-dashed p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No pending verifications</h3>
                <p className="text-muted-foreground mt-1">All {roleType}s are currently verified.</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-all duration-200 group">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                        {user.full_name ? user.full_name[0] : user.email[0].toUpperCase()}
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="font-bold text-lg text-foreground leading-tight">{user.full_name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <FileText className="w-3.5 h-3.5" /> {user.email}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-primary/60" />
                            <span className="text-foreground">{user.phone_number || "No phone provided"}</span>
                          </div>
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary/60 mt-0.5" />
                            <span className="text-foreground line-clamp-1">{user.address || "No address provided"}</span>
                          </div>
                          {user.nin_url && (
                            <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2 mt-1">
                              <Building className="w-4 h-4 text-primary/60" />
                              <a 
                                href={user.nin_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                              >
                                View NIN Card <FileText className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto border-t md:border-0 pt-4 md:pt-0">
                      <Button 
                        onClick={() => handleVerify(user.id)}
                        className="flex-1 md:flex-none bg-stat-up text-primary-foreground hover:bg-stat-up/90 shadow-sm"
                      >
                        <Check className="w-4 h-4 mr-2" /> Verify {roleType === "farmer" ? "Farmer" : "Buyer"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
                      >
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
