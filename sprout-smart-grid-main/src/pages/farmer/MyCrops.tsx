import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { farmerNavItems } from "@/constants/navigation";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { cropsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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

export default function MyCrops() {
  const [crops, setCrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fetchMyCrops = async () => {
    setIsLoading(true);
    try {
      const data = await cropsApi.getMyCrops();
      setCrops(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch your crops.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCrops();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await cropsApi.delete(id);
      setCrops(crops.filter((c) => c.id !== id));
      toast({ title: "Success", description: "Crop deleted successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete crop.", variant: "destructive" });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;
    setIsUpdating(true);
    try {
      await cropsApi.update(editingCrop.id, {
        name: editingCrop.name,
        category: editingCrop.category,
        description: editingCrop.description,
        price_per_unit: parseFloat(editingCrop.price_per_unit),
        unit: editingCrop.unit,
        quantity_available: parseFloat(editingCrop.quantity_available),
        location: editingCrop.location,
      });
      toast({ title: "Success", description: "Crop updated successfully." });
      setEditingCrop(null);
      fetchMyCrops();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update crop.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && crops.length === 0) {
    return (
      <DashboardLayout navItems={farmerNavItems} title="My Crops">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading your crops...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={farmerNavItems} title="My Crops">
      <div className="space-y-6">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Your Crop Listings</h2>
              <p className="text-sm text-muted-foreground">{crops.length} crops listed</p>
            </div>
            <Button asChild>
              <Link to="/farmer/add-crop">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Crop
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Crop</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌾</span>
                          <div>
                            <p className="font-medium text-foreground">{crop.name}</p>
                            <p className="text-xs text-muted-foreground">{crop.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-foreground tabular-nums">{crop.quantity_available} {crop.unit}</td>
                      <td className="p-3 text-foreground font-medium tabular-nums">₦{crop.price_per_unit}/{crop.unit}</td>
                      <td className="p-3 text-muted-foreground">{crop.location}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${crop.is_sold ? "bg-muted text-muted-foreground" : "bg-stat-up/10 text-stat-up"}`}>
                          {crop.is_sold ? "Sold" : "Active"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingCrop(crop)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(crop.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {crops.length === 0 && (
              <div className="p-12 text-center">
                <span className="text-4xl mb-3 block">🌱</span>
                <p className="text-foreground font-medium">No crops listed yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first crop to start selling</p>
                <Button asChild className="mt-4">
                  <Link to="/farmer/add-crop">Add Your First Crop</Link>
                </Button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Edit Crop Dialog */}
      <Dialog open={!!editingCrop} onOpenChange={(open) => !open && setEditingCrop(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Crop Listing</DialogTitle>
            <DialogDescription>Update the details of your crop listing for the marketplace.</DialogDescription>
          </DialogHeader>
          {editingCrop && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Crop Name</label>
                  <Input
                    value={editingCrop.name}
                    onChange={(e) => setEditingCrop({ ...editingCrop, name: e.target.value })}
                    placeholder="e.g. Yellow Maize"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Category</label>
                  <select 
                    value={editingCrop.category}
                    onChange={(e) => setEditingCrop({ ...editingCrop, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Tubers">Tubers</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Quantity Available</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingCrop.quantity_available}
                    onChange={(e) => setEditingCrop({ ...editingCrop, quantity_available: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Unit</label>
                  <Input
                    value={editingCrop.unit}
                    onChange={(e) => setEditingCrop({ ...editingCrop, unit: e.target.value })}
                    placeholder="e.g. kg, bags, tons"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Price per unit (₦)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingCrop.price_per_unit}
                    onChange={(e) => setEditingCrop({ ...editingCrop, price_per_unit: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Location</label>
                  <Input
                    value={editingCrop.location}
                    onChange={(e) => setEditingCrop({ ...editingCrop, location: e.target.value })}
                    placeholder="e.g. Kano, Kano State"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Description</label>
                <Textarea
                  value={editingCrop.description || ""}
                  onChange={(e) => setEditingCrop({ ...editingCrop, description: e.target.value })}
                  placeholder="Tell buyers more about your crop quality, freshness, or delivery options..."
                  rows={4}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingCrop(null)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : "Update Listing"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
