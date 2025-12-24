import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft, Lock, User, Send } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailSchema = z.string().email("Ange en giltig e-postadress");
const passwordSchema = z.string().min(6, "Lösenordet måste vara minst 6 tecken");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("password");
  const { user, isPartner, loading: authLoading, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in - partners go to /partner, others to /dashboard
  useEffect(() => {
    if (!authLoading && user) {
      if (isPartner) {
        navigate("/partner");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isPartner, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.issues[0].message);
      return;
    }

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.issues[0].message);
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("Den här e-postadressen är redan registrerad. Försök logga in istället.");
          } else {
            setError(signUpError.message);
          }
        } else {
          toast({
            title: "Konto skapat!",
            description: "Du är nu inloggad.",
          });
          navigate("/dashboard");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Fel e-post eller lösenord. Försök igen.");
          } else {
            setError(signInError.message);
          }
        } else {
          toast({
            title: "Inloggad!",
            description: "Välkommen tillbaka.",
          });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("Något gick fel. Försök igen.");
    }
    
    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate email
    const emailResult = emailSchema.safeParse(magicLinkEmail);
    if (!emailResult.success) {
      setError(emailResult.error.issues[0].message);
      return;
    }

    setMagicLinkLoading(true);
    
    try {
      const { error } = await signInWithMagicLink(magicLinkEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setMagicLinkSent(true);
        toast({
          title: "Länk skickad!",
          description: "Kolla din e-post för att logga in.",
        });
      }
    } catch (err) {
      setError("Något gick fel. Försök igen.");
    }
    
    setMagicLinkLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Skapa konto" : "Logga in"} | Flyttbas</title>
        <meta name="description" content="Logga in på Flyttbas för att hantera dina flyttförfrågningar och offerter." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {activeTab === "magic-link" ? <Mail className="h-6 w-6 text-primary" /> : 
               isSignUp ? <User className="h-6 w-6 text-primary" /> : <Lock className="h-6 w-6 text-primary" />}
            </div>
            <CardTitle>{isSignUp ? "Skapa konto" : "Logga in"}</CardTitle>
            <CardDescription>
              Välj hur du vill logga in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="password">
                  <Lock className="h-4 w-4 mr-2" />
                  Lösenord
                </TabsTrigger>
                <TabsTrigger value="magic-link">
                  <Mail className="h-4 w-4 mr-2" />
                  Magisk länk
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="password">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-postadress</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="din@email.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                  </div>

                  {error && activeTab === "password" && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Vänta..." : (isSignUp ? "Skapa konto" : "Logga in")}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                    }}
                  >
                    {isSignUp 
                      ? "Har du redan ett konto? Logga in" 
                      : "Inget konto? Skapa ett"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="magic-link">
                {magicLinkSent ? (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Send className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Kolla din e-post!</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Vi har skickat en inloggningslänk till <strong>{magicLinkEmail}</strong>
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMagicLinkSent(false);
                        setMagicLinkEmail("");
                      }}
                    >
                      Skicka till en annan e-post
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="magicLinkEmail">E-postadress</Label>
                      <Input
                        id="magicLinkEmail"
                        type="email"
                        placeholder="din@email.se"
                        value={magicLinkEmail}
                        onChange={(e) => setMagicLinkEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    {error && activeTab === "magic-link" && (
                      <p className="text-sm text-destructive" role="alert">
                        {error}
                      </p>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={magicLinkLoading}>
                      <Mail className="h-4 w-4 mr-2" />
                      {magicLinkLoading ? "Skickar..." : "Skicka inloggningslänk"}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Vi skickar en länk till din e-post som du kan använda för att logga in utan lösenord.
                    </p>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tillbaka till startsidan
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
