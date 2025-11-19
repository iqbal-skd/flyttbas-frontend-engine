import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 lg:bottom-6 right-6 z-40 bg-accent hover:bg-accent/90 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Öppna chatt"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window (UI Only - Non-functional) */}
      {isOpen && (
        <Card className="fixed bottom-36 lg:bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm shadow-2xl">
          <CardHeader className="bg-navy text-white rounded-t-lg">
            <CardTitle className="text-lg">Hej! 👋</CardTitle>
            <CardDescription className="text-white/80">
              Vad vill du göra?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/kontakt'}
            >
              Få offert
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/priser'}
            >
              Se priser
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              asChild
            >
              <a href="tel:+46701234567">Koppla till kundsupport</a>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Vi svarar vanligtvis inom några minuter
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
