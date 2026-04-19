import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
    <span className="font-display text-2xl tracking-wide text-gradient-gold">
      Digital<span className="font-script text-3xl ml-1">Invition</span>
    </span>
  </Link>
);
