import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { farmerNavItems, buyerNavItems } from "@/constants/navigation";
import { useState, useEffect } from "react";
import { cropsApi, authApi } from "@/lib/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketPrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("farmer");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceData, userData] = await Promise.all([
          cropsApi.getMarketStats(),
          authApi.getMe().catch(() => ({ role: "farmer" }))
        ]);
        setPrices(priceData);
        setUserRole(userData.role || "farmer");
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const navItems = userRole === "buyer" ? buyerNavItems : farmerNavItems;

  return (
    <DashboardLayout navItems={navItems} title="Market Prices">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Market Status", value: "Active", sub: "Prices updated live", color: "text-emerald-500" },
              { label: "Top Category", value: prices.length > 0 ? prices[0].category : "Grains", sub: "Most listings today" },
              { label: "Global Trend", value: "+2.4%", sub: "Average increase", color: "text-emerald-500" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border p-5">
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className={`text-lg font-bold ${s.color || "text-foreground"}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-5 border-b space-y-1">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">Category Price Index</h2>
                <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded">Updated hourly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This table shows the **average market price** for different crop categories based on all active listings on the platform. 
                Use this to compare your prices with the current market average.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-xs uppercase tracking-wider">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Crop Category</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Market Average</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Market Trend</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">24h Change</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Market Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                        Loading market data...
                      </td>
                    </tr>
                  ) : prices.map((row) => (
                    <tr key={row.category} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{row.category}</div>
                      </td>
                      <td className="p-4 text-foreground font-medium tabular-nums">₦{row.price} / {row.unit}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {row.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : 
                           row.trend === "down" ? <TrendingDown className="w-4 h-4 text-rose-500" /> : 
                           <Minus className="w-4 h-4 text-muted-foreground" />}
                          <span className={`capitalize font-medium ${
                            row.trend === "up" ? "text-emerald-600" : 
                            row.trend === "down" ? "text-rose-600" : 
                            "text-muted-foreground"
                          }`}>
                            {row.trend === "up" ? "Increasing" : row.trend === "down" ? "Decreasing" : "Stable"}
                          </span>
                        </div>
                      </td>
                      <td className={`p-4 font-bold tabular-nums ${
                        row.trend === "up" ? "text-emerald-600" : 
                        row.trend === "down" ? "text-rose-600" : 
                        "text-muted-foreground"
                      }`}>
                        {row.change}
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        {row.listings} live listings
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
