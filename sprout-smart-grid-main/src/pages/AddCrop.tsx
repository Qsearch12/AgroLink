import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { farmerNavItems } from "@/constants/navigation";
import { useState } from "react";
import { cropsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function AddCrop() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    location: "",
    category: "Grains",
    description: "",
    unit: "kg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await cropsApi.create({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price_per_unit: parseFloat(formData.price),
        unit: formData.unit,
        quantity_available: parseFloat(formData.quantity),
        location: formData.location,
      });
      setSubmitted(true);
      toast({ title: "Success", description: "Crop listed successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to list crop", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={farmerNavItems} title="Add New Crop">
      <ScrollReveal>
        <div className="max-w-2xl">
          {submitted ? (
            <div className="bg-surface-green rounded-xl border p-12 text-center space-y-6 shadow-sm border-primary/20">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl mx-auto">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Crop Listed Successfully!</h2>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Your crop listing is now live and visible to buyers on the marketplace.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setSubmitted(false)} size="lg">Add Another Crop</Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/farmer/crops">View My Listings</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-xl border p-6 md:p-10 space-y-8 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground">Listing Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Provide accurate details to attract more buyers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Crop Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yellow Maize"
                    className="w-full h-11 px-4 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Tubers">Tubers</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Quantity Available</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 500"
                      className="flex-1 h-11 px-4 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <input
                      required
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="Unit (kg/bags)"
                      className="w-24 h-11 px-4 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Price per {formData.unit || 'unit'} (₦)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 15000.50"
                    className="w-full h-11 px-4 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Location</label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Ibadan, Oyo State"
                  className="w-full h-11 px-4 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Detailed Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your crop's quality, variety, harvest date, and any special features..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Publishing Listing...
                    </span>
                  ) : "List Crop on Marketplace"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </ScrollReveal>
    </DashboardLayout>
  );
}
