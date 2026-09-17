import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`group inline-flex items-baseline gap-2 ${className}`}>
    <span className="font-display text-2xl tracking-[0.2em] uppercase text-gradient-gold">
      Zareqia
    </span>
    <span className="hidden sm:inline text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground">
      Invitations
    </span>
  </Link>
);
