import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/constants/navigation";
import { Search, Eye, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

const allListings = [
  { id: 1, crop: "Organic Maize", farmer: "Olawale Benson", price: "₦180,000/ton", quantity: "2,000 kg", location: "Kaduna", status: "Active", flagged: false },
  { id: 2, crop: "Brown Rice", farmer: "Ibrahim Sule", price: "₦320,000/ton", quantity: "5,000 kg", location: "Kano", status: "Active", flagged: false },
  { id: 3, crop: "Fresh Tomatoes", farmer: "Amina Yusuf", price: "₦15,000/crate", quantity: "500 crates", location: "Jos", status: "Active", flagged: true },
  { id: 4, crop: "Cassava", farmer: "Chinedu Okeke", price: "₦120,000/ton", quantity: "3,000 kg", location: "Enugu", status: "Sold", flagged: false },
  { id: 5, crop: "Cocoa Beans", farmer: "Bisi Akande", price: "₦2,800,000/ton", quantity: "800 kg", location: "Ondo", status: "Active", flagged: false },
  { id: 6, crop: "Groundnuts", farmer: "Tunde Ednut", price: "₦400,000/ton", quantity: "1,200 kg", location: "Sokoto", status: "Removed", flagged: true },
  { id: 7, crop: "Yam Tubers", farmer: "Olawale Benson", price: "₦200,000/ton", quantity: "1,500 kg", location: "Oyo", status: "Active", flagged: false },
];

export default function CropListings() {
  const [search, setSearch] = useState("");
  const filtered = allListings.filter((l) =>
    l.crop.toLowerCase().includes(search.toLowerCase()) || l.farmer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={adminNavItems} title="Crop Listings">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Total Listings</div>
              <div className="text-2xl font-bold text-foreground tabular-nums">12,340</div>
            </div>
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Active</div>
              <div className="text-2xl font-bold text-stat-up tabular-nums">10,892</div>
            </div>
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Sold</div>
              <div className="text-2xl font-bold text-primary tabular-nums">1,203</div>
            </div>
            <div className="bg-card rounded-lg border p-5">
              <div className="text-xs text-muted-foreground mb-1">Flagged</div>
              <div className="text-2xl font-bold text-destructive tabular-nums">245</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Crop</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Farmer</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${l.flagged ? "bg-destructive/5" : ""}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {l.flagged && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                          <span className="font-medium text-foreground">{l.crop}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{l.farmer}</td>
                      <td className="p-3 text-foreground font-medium tabular-nums">{l.price}</td>
                      <td className="p-3 text-foreground tabular-nums">{l.quantity}</td>
                      <td className="p-3 text-muted-foreground">{l.location}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          l.status === "Active" ? "bg-stat-up/10 text-stat-up" :
                          l.status === "Sold" ? "bg-primary/10 text-primary" :
                          "bg-destructive/10 text-destructive"
                        }`}>{l.status}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
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
