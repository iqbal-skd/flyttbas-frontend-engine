import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const passwordSchema = z.string().min(6, "Lösenordet måste vara minst 6 tecken");

const SetupPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle magic link tokens from URL hash on mount
  useEffect(() => {
    const handleHashTokens = async () => {
      // Check if there are auth tokens in the URL hash (from magic link)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Found auth tokens in URL, processing...");
        // Supabase client will automatically pick up these tokens
        // Wait a moment for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setIsProcessingAuth(false);
    };
    
    handleHashTokens();
  }, []);

  // Check if user is authenticated (came from magic link)
  useEffect(() => {
    if (!isProcessingAuth && !authLoading && !user) {
      // User is not authenticated, redirect to auth page
      console.log("No user found after processing, redirecting to auth");
      navigate("/auth");
    }
  }, [user, authLoading, isProcessingAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.issues[0].message);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        toast({
          title: "Lösenord sparat!",
          description: "Du kan nu logga in med e-post och lösenord.",
        });
        
        // Redirect to dashboard after a short delay
        const quoteId = searchParams.get("quote");
        setTimeout(() => {
          if (quoteId) {
            navigate(`/dashboard?quote=${quoteId}`);
          } else {
            navigate("/dashboard");
          }
        }, 2000);
      }
    } catch (err) {
      setError("Något gick fel. Försök igen.");
    }

    setLoading(false);
  };

  if (authLoading || isProcessingAuth) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">Verifierar din inloggning...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Lösenord sparat | Flyttbas</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Lösenord sparat!</h2>
              <p className="text-muted-foreground">
                Du kan nu logga in med din e-post och lösenord. Du skickas vidare...
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Skapa lösenord | Flyttbas</title>
        <meta name="description" content="Skapa ett lösenord för ditt Flyttbas-konto." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Skapa ditt lösenord</CardTitle>
            <CardDescription>
              Välj ett lösenord så kan du enkelt logga in nästa gång utan e-postlänk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minst 6 tecken"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Skriv lösenordet igen"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sparar..." : "Spara lösenord"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => {
                  const quoteId = searchParams.get("quote");
                  if (quoteId) {
                    navigate(`/dashboard?quote=${quoteId}`);
                  } else {
                    navigate("/dashboard");
                  }
                }}
              >
                Hoppa över, gå till mina offerter
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default SetupPassword;
