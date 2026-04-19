import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const SiteHeader = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-gold/10">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/#features" className="text-muted-foreground hover:text-gold transition-colors">Features</a>
          <a href="/#how" className="text-muted-foreground hover:text-gold transition-colors">How It Works</a>
          <a href="/#pricing" className="text-muted-foreground hover:text-gold transition-colors">Pricing</a>
          <Link to="/templates" className="text-muted-foreground hover:text-gold transition-colors">Templates</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" asChild><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Login</Link></Button>
              <Button variant="gold" size="sm" asChild><Link to="/templates">Get Started</Link></Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gold"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/10 bg-background/95 backdrop-blur">
          <div className="container py-4 flex flex-col gap-3">
            <a href="/#features" onClick={() => setOpen(false)} className="py-2 text-sm">Features</a>
            <a href="/#how" onClick={() => setOpen(false)} className="py-2 text-sm">How It Works</a>
            <a href="/#pricing" onClick={() => setOpen(false)} className="py-2 text-sm">Pricing</a>
            <Link to="/templates" onClick={() => setOpen(false)} className="py-2 text-sm">Templates</Link>
            {user ? (
              <>
                <Button variant="outline" asChild><Link to="/dashboard">Dashboard</Link></Button>
                <Button variant="ghost" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild><Link to="/auth">Login</Link></Button>
                <Button variant="gold" asChild><Link to="/templates">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
