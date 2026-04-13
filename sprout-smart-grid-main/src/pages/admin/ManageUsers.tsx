import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/constants/navigation";
import { ShieldCheck, Search } from "lucide-react";
import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Kofi Ansah", type: "Farmer", email: "kofi@example.com", status: "Active", joined: "Jan 2026", listings: 8 },
  { id: 2, name: "Fatima Osei", type: "Buyer", email: "fatima@example.com", status: "Verified", joined: "Feb 2026", listings: 0 },
  { id: 3, name: "Ibrahim Sule", type: "Farmer", email: "ibrahim@example.com", status: "Active", joined: "Mar 2026", listings: 12 },
  { id: 4, name: "Ama Darko", type: "Farmer", email: "ama@example.com", status: "Pending", joined: "Mar 2026", listings: 3 },
  { id: 5, name: "Grace Tetteh", type: "Buyer", email: "grace@example.com", status: "Active", joined: "Mar 2026", listings: 0 },
  { id: 6, name: "Kwame Boateng", type: "Farmer", email: "kwame@example.com", status: "Active", joined: "Feb 2026", listings: 5 },
  { id: 7, name: "Patience Adu", type: "Farmer", email: "patience@example.com", status: "Suspended", joined: "Jan 2026", listings: 2 },
  { id: 8, name: "Yaw Mensah", type: "Buyer", email: "yaw@example.com", status: "Pending", joined: "Mar 2026", listings: 0 },
];

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Farmer" | "Buyer">("All");
  const users = initialUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || u.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout navItems={adminNavItems} title="Manage Users">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-md border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              {(["All", "Farmer", "Buyer"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.type === "Farmer" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
                        }`}>{u.type}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs font-medium ${
                          u.status === "Active" || u.status === "Verified" ? "text-stat-up" :
                          u.status === "Suspended" ? "text-destructive" : "text-accent"
                        }`}>{u.status}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{u.joined}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          {u.status === "Suspended" ? (
                            <Button size="sm" variant="outline" className="text-stat-up border-stat-up/30">Reactivate</Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-destructive border-destructive/30">Suspend</Button>
                          )}
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
