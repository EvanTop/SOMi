import { siteConfig } from "@/lib/data";
import { Lock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin888") {
      toast.success(t("login.success"));
      localStorage.setItem("somi_auth", "true");
      setLocation("/admin");
      setShowLogin(false);
    } else {
      toast.error(t("login.denied"));
      setPassword("");
    }
  };

  return (
    <footer className="w-full py-16 px-4 md:px-0 mt-12 border-t border-border/20 bg-background">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Top Row: Navigation Links (Justify Between) */}
        <div className="flex w-full justify-between items-start">
           {siteConfig.footerLinks.map((link) => (
             <a key={link.title} href={link.url} className="group block text-left">
               <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-wider">{link.title}</h4>
               <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 mt-1">{link.desc}</p>
             </a>
           ))}
        </div>

        {/* Bottom Row: Login/Copyright (Left) & Icons (Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/20 pt-8">
          
          {/* Left: Login & Copyright */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors group"
            >
              <Lock className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </button>
            <span className="text-sm font-bold tracking-tight text-muted-foreground">© {new Date().getFullYear()} {siteConfig.title}</span>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            {siteConfig.footerIcons.map((icon) => (
              <a 
                key={icon.title} 
                href={icon.url} 
                target="_blank" 
                rel="noreferrer"
                className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                title={icon.title}
              >
                <img src={icon.src} alt={icon.title} className="w-5 h-5 object-contain" />
              </a>
            ))}
          </div>

        </div>

      </div>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("login.title")}</DialogTitle>
            <DialogDescription>
              {t("login.desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder={t("login.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center tracking-widest"
              autoFocus
            />
            <Button type="submit" className="w-full">
              {t("login.enter")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
