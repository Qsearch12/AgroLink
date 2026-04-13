import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingVerification from "./pages/PendingVerification";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AddCrop from "./pages/AddCrop";
import AIRecommendation from "./pages/AIRecommendation";
import MarketPrices from "./pages/MarketPrices";
import AdminDashboard from "./pages/AdminDashboard";
import MyCrops from "./pages/farmer/MyCrops";
import BuyerRequests from "./pages/farmer/BuyerRequests";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerMessages from "./pages/farmer/FarmerMessages";
import BuyerMarketplace from "./pages/buyer/BuyerMarketplace";
import CropDetails from "./pages/buyer/CropDetails";
import SavedCrops from "./pages/buyer/SavedCrops";
import BuyerMessages from "./pages/buyer/BuyerMessages";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import ManageUsers from "./pages/admin/ManageUsers";
import VerifyBuyers from "./pages/admin/VerifyBuyers";
import CropListings from "./pages/admin/CropListings";
import SystemStats from "./pages/admin/SystemStats";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-verification" element={<PendingVerification />} />

            {/* Farmer */}
            <Route path="/farmer" element={<ProtectedRoute allowedRoles={["farmer"]}><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/crops" element={<ProtectedRoute allowedRoles={["farmer"]}><MyCrops /></ProtectedRoute>} />
            <Route path="/farmer/add-crop" element={<ProtectedRoute allowedRoles={["farmer"]}><AddCrop /></ProtectedRoute>} />
            <Route path="/farmer/requests" element={<ProtectedRoute allowedRoles={["farmer"]}><BuyerRequests /></ProtectedRoute>} />
            <Route path="/farmer/ai" element={<ProtectedRoute allowedRoles={["farmer"]}><AIRecommendation /></ProtectedRoute>} />
            <Route path="/farmer/prices" element={<ProtectedRoute allowedRoles={["farmer"]}><MarketPrices /></ProtectedRoute>} />
            <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={["farmer"]}><FarmerProfile /></ProtectedRoute>} />
            <Route path="/farmer/messages" element={<ProtectedRoute allowedRoles={["farmer"]}><FarmerMessages /></ProtectedRoute>} />

            {/* Buyer */}
            <Route path="/buyer" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerDashboard /></ProtectedRoute>} />
            <Route path="/buyer/marketplace" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerMarketplace /></ProtectedRoute>} />
            <Route path="/buyer/crop/:id" element={<ProtectedRoute allowedRoles={["buyer"]}><CropDetails /></ProtectedRoute>} />
            <Route path="/buyer/saved" element={<ProtectedRoute allowedRoles={["buyer"]}><SavedCrops /></ProtectedRoute>} />
            <Route path="/buyer/messages" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerMessages /></ProtectedRoute>} />
            <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/verify" element={<ProtectedRoute allowedRoles={["admin"]}><VerifyBuyers /></ProtectedRoute>} />
            <Route path="/admin/listings" element={<ProtectedRoute allowedRoles={["admin"]}><CropListings /></ProtectedRoute>} />
            <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={["admin"]}><SystemStats /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
