import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface CropCardProps {
  name: string;
  price: string | number;
  quantity: string | number;
  unit?: string;
  location: string;
  farmer: string;
  category?: string;
  description?: string;
  id?: string | number;
  is_sold?: boolean;
  is_verified?: boolean;
  created_at?: string;
}

export function CropCard({ id, name, price, quantity, unit, location, farmer, category, description, is_sold, is_verified, created_at }: CropCardProps) {
  const priceStr = typeof price === "number" ? `₦${price}${unit ? `/${unit}` : ""}` : price;
  const qtyStr = typeof quantity === "number" ? `${quantity}${unit ? ` ${unit}` : ""}` : quantity;

  return (
    <div className="bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative">
      {/* Dynamic Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {!is_sold ? (
          <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-none text-[10px] h-5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" />
            Live
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px] h-5 px-2">Sold Out</Badge>
        )}
      </div>

      <div className="h-40 bg-surface-green flex items-center justify-center relative">
        <span className="text-4xl">🌾</span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-foreground truncate mr-2" title={name}>{name}</h3>
            {category && <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{category}</span>}
          </div>
          <span className="text-primary font-bold whitespace-nowrap">{priceStr}</span>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1.5 pt-1">
          <p className="flex items-center gap-1.5 truncate"><span>📦</span> {qtyStr}</p>
          <p className="flex items-center gap-1.5 truncate"><span>📍</span> {location}</p>
          <div className="flex items-center gap-1.5 truncate">
            <span>👤</span> {farmer}
            {is_verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
            )}
          </div>
          
          {description && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-2 border-t pt-2 italic leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {created_at && (
          <div className="pt-2 flex items-center gap-1 text-[10px] text-muted-foreground border-t mt-2">
            <Clock className="w-3 h-3" />
            Listed {new Date(created_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
