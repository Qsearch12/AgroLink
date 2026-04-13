import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function PendingVerification() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <ScrollReveal className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl border shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verification Pending</h1>
          <p className="text-muted-foreground">
            Thank you for registering with AgroLink! Your account is currently under review by our administration team.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start gap-3 text-left">
            <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">NIN Review</p>
              <p className="text-xs text-muted-foreground">We are verifying your National Identity details.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-left">
            <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Profile Security</p>
              <p className="text-xs text-muted-foreground">Checking your business/farm address and phone number.</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-xl text-sm italic text-muted-foreground">
          "This usually takes 24-48 hours. You will be able to access your dashboard once approved."
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Sign Out
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/">Go to Homepage</Link>
          </Button>
        </div>
      </ScrollReveal>
      
      <p className="mt-8 text-xs text-muted-foreground">
        © 2026 AgroLink Nigeria. All rights reserved.
      </p>
    </div>
  );
}
