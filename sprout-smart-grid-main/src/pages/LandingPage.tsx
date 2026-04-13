import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Sprout, BarChart3, ShoppingCart, ArrowRight, Leaf, TrendingUp, Users, UserPlus, BrainCircuit, Handshake, MapPin, Package, Heart, Eye, Send } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cropsApi } from "@/lib/api";
import { AuthGuardDialog } from "@/components/AuthGuardDialog";

const features = [
  {
    icon: <Sprout className="w-6 h-6" />,
    title: "AI Crop Advisor",
    desc: "Get personalized crop recommendations based on your soil, location, and farm size.",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Digital Marketplace",
    desc: "List your harvest and connect directly with verified buyers — no middlemen.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Price Intelligence",
    desc: "Track real-time market prices and regional trends to sell at the right moment.",
  },
];

const steps = [
  { 
    num: "01", 
    title: "Create Your Profile", 
    desc: "Sign up as a farmer or buyer in under two minutes with your NIN.",
    icon: <UserPlus className="w-6 h-6" />
  },
  { 
    num: "02", 
    title: "Get AI Insights", 
    desc: "Enter your farm details and let AI suggest the best crops for your soil.",
    icon: <BrainCircuit className="w-6 h-6" />
  },
  { 
    num: "03", 
    title: "Trade Directly", 
    desc: "List your produce or browse the marketplace and connect instantly.",
    icon: <Handshake className="w-6 h-6" />
  },
];

const testimonials = [
  { name: "Olawale Benson", role: "Grain Farmer, Kaduna", quote: "AgroLink helped me find the right crop for my soil type. My yield improved by 35% in one season." },
  { name: "Chinedu Okeke", role: "Produce Buyer, Lagos", quote: "I can source fresh produce directly from verified farmers. The quality and pricing transparency is unmatched." },
  { name: "Amina Yusuf", role: "Cocoa Farmer, Ondo", quote: "The market price dashboard alone saved me from selling below market rate. Truly a game-changer." },
];

export default function LandingPage() {
  const [featuredCrops, setFeaturedCrops] = useState<any[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await cropsApi.getAll();
        setFeaturedCrops(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured crops:", error);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <span className="text-2xl">🌿</span> AgroLink
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/register">Get Started</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] -z-20" />
        </div>
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-2xl space-y-8 animate-reveal-up text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 shadow-xl shadow-primary/5 mx-auto lg:mx-0">
                <Leaf className="w-4 h-4 text-emerald-500" /> AI-Powered Agriculture · Nigeria
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter italic">
                Grow <span className="text-emerald-500">Smarter,</span> <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-accent animate-gradient-x">Trade Faster</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AgroLink connects Nigerian farmers with verified buyers using AI-driven insights to optimize your harvest and maximize your profits.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl" className="rounded-full px-12 group" asChild>
                  <Link to="/register">Get Started <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
                <Button variant="hero-outline" size="xl" className="rounded-full px-12" asChild>
                  <Link to="/buyer/marketplace">Marketplace</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-8 justify-center lg:justify-start border-t border-primary/10">
                {[
                  { label: "Farmers", val: "50k+" },
                  { label: "Daily Trades", val: "₦150M+" },
                  { label: "Locations", val: "36 States" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-foreground tracking-tight">{s.val}</div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative animate-reveal-up stagger-2 w-full max-w-lg lg:max-w-none">
              <div className="relative z-10 bg-card/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative aspect-[4/3] rounded-2xl bg-surface-green dark:bg-primary/5 overflow-hidden flex items-center justify-center text-8xl shadow-inner group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-overlay" />
                  <span className="drop-shadow-2xl filter contrast-125">🌾</span>
                </div>
                <div className="mt-8 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/3 bg-primary/20 rounded-full animate-pulse" />
                    <div className="px-3 py-1 rounded-full bg-stat-up/10 text-stat-up text-[10px] font-bold uppercase tracking-widest">Live Market</div>
                  </div>
                  <div className="h-3 w-full bg-muted/40 rounded-full" />
                  <div className="h-3 w-2/3 bg-muted/40 rounded-full" />
                  <div className="pt-4 flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                    <div className="h-8 w-8 rounded-full bg-accent/20" />
                    <div className="h-8 w-8 rounded-full bg-muted/40" />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/30 rounded-full blur-[100px] -z-10 animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <ScrollReveal className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Grow</h2>
            <p className="text-muted-foreground">From planting decisions to market access — AgroLink covers the full journey.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <div className="bg-card rounded-xl border p-8 h-full hover:shadow-lg transition-shadow duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live Marketplace Preview */}
      <section id="marketplace" className="py-20 bg-muted/30">
        <div className="container">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">Live Marketplace</h2>
            <p className="text-muted-foreground">Browse real-time listings from verified Nigerian farmers. Sign up to start trading.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCrops.length > 0 ? featuredCrops.map((crop, i) => (
              <ScrollReveal key={crop.id} delay={i * 100}>
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group">
                  <div className="h-40 bg-surface-green flex items-center justify-center relative overflow-hidden">
                    <span className="text-5xl group-hover:scale-125 transition-transform duration-500">🌾</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={() => setIsAuthDialogOpen(true)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-card/90 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground leading-tight truncate">{crop.name}</h3>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-1.5 py-0.5 rounded mt-1 inline-block">{crop.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-black text-lg leading-none">₦{crop.price_per_unit}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">/{crop.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span className="truncate">{crop.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button size="sm" variant="outline" className="rounded-xl font-bold h-9" onClick={() => setIsAuthDialogOpen(true)}>
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
                      </Button>
                      <Button size="sm" className="rounded-xl font-bold h-9 shadow-lg shadow-primary/10" onClick={() => setIsAuthDialogOpen(true)}>
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Request
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )) : (
              <div className="col-span-full py-20 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 w-48 bg-muted rounded-full mx-auto" />
                  <p className="text-muted-foreground">Fetching latest listings...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="hero-outline" className="rounded-full px-12 font-bold group" asChild>
              <Link to="/register">View Full Marketplace <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 md:py-32 bg-primary/[0.02] dark:bg-black/40 relative overflow-hidden transition-colors duration-500">
        {/* Background decorative blobs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container relative z-10">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6">Start Your Journey</h2>
            <p className="text-muted-foreground text-lg">Experience the next generation of Nigerian agriculture in three simple steps.</p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            {/* Connecting lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t border-dashed border-primary/30 -z-10" />
            
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 150}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-3xl bg-card border shadow-xl flex items-center justify-center relative mb-8 group-hover:scale-110 transition-transform duration-500 hover:shadow-primary/20">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg ring-4 ring-background">
                      {s.num}
                    </div>
                    <div className="text-primary">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="container">
          <ScrollReveal className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Farmers</h2>
            <p className="text-muted-foreground">See what our community has to say.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="bg-card rounded-xl border p-6 h-full">
                  <p className="text-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-20 md:py-28 bg-primary">
          <div className="container text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Transform Your Farm?</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">Join thousands of farmers making smarter decisions with AgroLink.</p>
            <Button size="xl" variant="secondary" asChild>
              <Link to="/register">Start Free Today <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground mb-3">
                <span className="text-xl">🌿</span> AgroLink
              </div>
              <p className="text-sm text-muted-foreground">Smart agriculture for everyone.</p>
            </div>
            {[
              { title: "Platform", links: ["Marketplace", "AI Advisor", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
            © 2026 AgroLink. All rights reserved.
          </div>
        </div>
      </footer>

      <AuthGuardDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </div>
  );
}
