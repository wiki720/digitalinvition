import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import ornament from "@/assets/gold-ornament.png";

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const next = params.get("next") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}${next}`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} aria-hidden />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <img src={ornament} alt="" width={50} height={50} className="mx-auto mt-6 opacity-80" loading="lazy" />
          <h1 className="font-display text-3xl mt-4">{mode === "signin" ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signin" ? "Sign in to manage your invitations" : "Start crafting your perfect invitation"}
          </p>
        </div>

        <form onSubmit={submit} className="bg-card/60 backdrop-blur rounded-xl border border-gold/20 p-7 space-y-4 shadow-deep">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="mt-1.5" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5" />
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have one?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-gold hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-gold">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
