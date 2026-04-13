import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { farmerNavItems } from "@/constants/navigation";
import { Brain, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { aiApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const soilTypes = ["Sandy", "Clay", "Loamy", "Silt", "Peat", "Chalky"];

export default function AIRecommendation() {
  const [formData, setFormData] = useState({
    soil_type: "Sandy",
    location: "",
    farm_size: "",
  });
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await aiApi.getRecommendation({
        ...formData,
        farm_size: parseFloat(formData.farm_size),
      });
      setResult(data);
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not generate recommendation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={farmerNavItems} title="AI Crop Recommendation">
      <div className="max-w-3xl space-y-8">
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Farm Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about your farm to get personalized recommendations</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Soil Type</label>
              <select 
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input 
                required 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Tamale, Northern Region" 
                className="w-full h-10 px-3 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Farm Size (hectares)</label>
              <input 
                required 
                type="number" 
                value={formData.farm_size}
                onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                placeholder="e.g. 5" 
                className="w-full h-10 px-3 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Analyzing...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate Recommendation</span>
              )}
            </Button>
          </form>
        </ScrollReveal>

        {result && (
          <ScrollReveal>
            <div className="bg-card rounded-xl border overflow-hidden shadow-lg border-primary/20">
              <div className="bg-primary/5 border-b p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl shadow-inner">
                    🌾
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Recommended: {result.recommended_crop}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${result.confidence_score * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {Math.round(result.confidence_score * 100)}% Confidence
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Analysis Complete</p>
                  <p className="text-xs font-medium text-stat-up">Professional Grade Advice</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Optimal Planting Window", value: result.optimal_planting_time, icon: <Sparkles className="w-4 h-4" /> },
                    { label: "Projected Yield", value: result.expected_yield, icon: <TrendingUp className="w-4 h-4 text-primary" /> },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/30 rounded-xl p-5 border border-border/50 transition-all hover:border-primary/30 group">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                        {item.icon}
                        {item.label}
                      </div>
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Brain className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Expert Analysis & Strategic Advice</h4>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                    {result.rationale.split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className={paragraph.includes('Tips:') ? 'font-medium text-foreground bg-primary/5 p-4 rounded-lg border-l-4 border-primary' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" variant="outline" onClick={() => window.print()}>
                    Download PDF Report
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/farmer/add-crop">
                      List this crop now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </DashboardLayout>
  );
}
