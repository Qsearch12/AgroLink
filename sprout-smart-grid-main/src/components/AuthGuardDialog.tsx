import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

interface AuthGuardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthGuardDialog({ open, onOpenChange }: AuthGuardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">Authentication Required</DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            You need to be signed in as a buyer to interact with crop listings, save favorites, or send purchase requests.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
            <Link to="/register">Create an Account</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-11 rounded-xl text-base font-bold">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
        <DialogFooter className="sm:justify-center mt-2">
          <p className="text-xs text-muted-foreground">Join 50,000+ Nigerian farmers and buyers today.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
