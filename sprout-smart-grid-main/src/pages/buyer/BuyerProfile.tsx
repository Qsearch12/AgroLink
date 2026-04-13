import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { buyerNavItems } from "@/constants/navigation";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export default function BuyerProfile() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.getMe();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout navItems={buyerNavItems} title="Profile">
        <div className="p-8 text-center text-muted-foreground">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={buyerNavItems} title="Profile">
      <ScrollReveal>
        <div className="max-w-2xl space-y-6">
          <div className="bg-card rounded-xl border p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {user?.full_name ? user.full_name.split(" ").map((n: any) => n[0]).join("") : "U"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user?.full_name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role} · {user?.is_verified ? "Verified Buyer" : "Verification Pending"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Account Status: {user?.is_active ? "Active" : "Inactive"}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Business Account Details</h3>
            {[
              { label: "Full Name", value: user?.full_name },
              { label: "Email Address", value: user?.email },
              { label: "Account Role", value: user?.role },
              { label: "Verification", value: user?.is_verified ? "Verified" : "Pending" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
            <Button variant="outline" className="mt-2">Edit Account Info</Button>
          </div>
        </div>
      </ScrollReveal>
    </DashboardLayout>
  );
}
