import { FileText, Truck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileActionBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border shadow-lg">
      <div className="grid grid-cols-3 divide-x divide-border">
        <a
          href="#quote-wizard"
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <FileText className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Jämför</span>
        </a>
        
        <Link
          to="/bli-partner"
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <Truck className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Bli Partner</span>
        </Link>
        
        <Link
          to="/faq"
          className="flex flex-col items-center justify-center py-3 hover:bg-secondary transition-colors"
        >
          <HelpCircle className="h-5 w-5 text-accent mb-1" />
          <span className="text-xs font-medium text-foreground">Hjälp</span>
        </Link>
      </div>
    </div>
  );
};
