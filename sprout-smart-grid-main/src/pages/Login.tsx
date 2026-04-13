import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login({ username: email, password });
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("is_verified", String(response.is_verified));
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });

      if (response.role === "admin") {
        navigate("/admin");
      } else if (!response.is_verified) {
        navigate("/pending-verification");
      } else {
        navigate(response.role === "farmer" ? "/farmer" : "/buyer");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 max-w-md px-12 space-y-6">
          <div className="flex items-center gap-3 text-primary-foreground">
            <span className="text-4xl">🌿</span>
            <span className="text-3xl font-bold">AgroLink</span>
          </div>
          <h2 className="text-2xl font-semibold text-primary-foreground leading-snug">
            Welcome back to smarter farming
          </h2>
          <p className="text-primary-foreground/70 leading-relaxed">
            Access your dashboard, manage crop listings, and connect with the agricultural community.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { val: "2,847", label: "Farmers" },
              { val: "12,340", label: "Listings" },
              { val: "156", label: "Regions" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-primary-foreground tabular-nums">{s.val}</div>
                <div className="text-xs text-primary-foreground/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2 text-xl font-bold text-foreground">
            <span className="text-2xl">🌿</span> AgroLink
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your dashboard</p>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-lg border bg-muted/50 p-1">
            {(["farmer", "buyer"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  role === r
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "farmer" ? "👨‍🌾 Farmer" : "🛒 Buyer"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : `Sign In as ${role === "farmer" ? "Farmer" : "Buyer"}`}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
