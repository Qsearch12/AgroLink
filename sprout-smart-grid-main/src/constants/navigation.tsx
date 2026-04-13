import { LayoutDashboard, Wheat, PlusCircle, Brain, TrendingUp, User, Search, Heart, MessageCircle, Users, ShieldCheck, BarChart3, ClipboardList } from "lucide-react";

export const farmerNavItems = [
  { to: "/farmer", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { to: "/farmer/crops", icon: <Wheat className="w-5 h-5" />, label: "My Crops" },
  { to: "/farmer/add-crop", icon: <PlusCircle className="w-5 h-5" />, label: "Add Crop" },
  { to: "/farmer/requests", icon: <ClipboardList className="w-5 h-5" />, label: "Buyer Requests" },
  { to: "/farmer/messages", icon: <MessageCircle className="w-5 h-5" />, label: "Messages" },
  { to: "/farmer/ai", icon: <Brain className="w-5 h-5" />, label: "AI Recommendation" },
  { to: "/farmer/prices", icon: <TrendingUp className="w-5 h-5" />, label: "Market Prices" },
  { to: "/farmer/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
];

export const buyerNavItems = [
  { to: "/buyer", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { to: "/buyer/marketplace", icon: <Search className="w-5 h-5" />, label: "Marketplace" },
  { to: "/buyer/saved", icon: <Heart className="w-5 h-5" />, label: "Saved Crops" },
  { to: "/buyer/messages", icon: <MessageCircle className="w-5 h-5" />, label: "Messages" },
  { to: "/buyer/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
];

export const adminNavItems = [
  { to: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { to: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Manage Users" },
  { to: "/admin/verify", icon: <ShieldCheck className="w-5 h-5" />, label: "Verify Buyers" },
  { to: "/admin/listings", icon: <Wheat className="w-5 h-5" />, label: "Crop Listings" },
  { to: "/admin/stats", icon: <BarChart3 className="w-5 h-5" />, label: "System Stats" },
];
