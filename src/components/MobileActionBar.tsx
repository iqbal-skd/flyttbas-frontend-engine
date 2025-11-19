import { Phone, MessageCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileActionBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border shadow-lg">
      <div className="grid grid-cols-3 divide-x divide-border">
        <a
          href="tel:+46701234567"
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <Phone className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Ring</span>
        </a>
        
        <button
          onClick={() => {
            // Placeholder for chat functionality
            console.log("Chat clicked");
          }}
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Chatta</span>
        </button>
        
        <Link
          to="/kontakt"
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <FileText className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Offert</span>
        </Link>
      </div>
    </div>
  );
};
