
import { useState, useEffect } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import { useJurisdiction } from "@/contexts/JurisdictionContext";
import { jurisdictions } from "@/data/jurisdictions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function JurisdictionSelector() {
  const { currentJurisdiction, setJurisdiction } = useJurisdiction();
  const [isOpen, setIsOpen] = useState(false);
  const [ipBasedJurisdiction, setIpBasedJurisdiction] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is the first visit (no jurisdiction has been explicitly set)
    const hasSetJurisdiction = localStorage.getItem("hasSetJurisdiction");
    
    if (!hasSetJurisdiction) {
      // In a real implementation, we would make an API call to get the user's IP-based jurisdiction
      // For this prototype, we'll simulate detection after a short delay
      const detectJurisdiction = async () => {
        try {
          // This would be a real API call in production
          // Simulate a random jurisdiction detection for demonstration
          const detectedCodes = ["us", "uk", "ca", "au"];
          const randomIndex = Math.floor(Math.random() * detectedCodes.length);
          const detected = detectedCodes[randomIndex];
          
          setIpBasedJurisdiction(detected);
          
          // Only set automatically if the user hasn't made a selection yet
          if (!localStorage.getItem("userJurisdiction")) {
            setJurisdiction(detected);
          }
          
        } catch (error) {
          console.error("Error detecting jurisdiction:", error);
        }
      };
      
      // Simulate API delay
      setTimeout(detectJurisdiction, 1000);
    }
  }, [setJurisdiction]);

  const handleSelect = (code: string) => {
    setJurisdiction(code);
    localStorage.setItem("hasSetJurisdiction", "true");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 px-3 border-muted-foreground/20 hover:bg-muted"
          >
            <span className="text-base">{currentJurisdiction.flag}</span>
            <span className="text-sm font-medium hidden sm:block">
              {currentJurisdiction.name}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] p-2 bg-background shadow-lg border border-border"
        >
          <div className="text-xs text-muted-foreground mb-2 px-2 py-1">
            Select Jurisdiction
          </div>
          {jurisdictions.map((jurisdiction) => (
            <DropdownMenuItem
              key={jurisdiction.code}
              className={cn(
                "flex items-center gap-2 px-2 py-2 cursor-pointer",
                currentJurisdiction.code === jurisdiction.code && "bg-muted"
              )}
              onClick={() => handleSelect(jurisdiction.code)}
            >
              <span className="text-base">{jurisdiction.flag}</span>
              <span className="flex-grow text-sm">{jurisdiction.name}</span>
              {currentJurisdiction.code === jurisdiction.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
              {ipBasedJurisdiction === jurisdiction.code && 
                currentJurisdiction.code !== jurisdiction.code && (
                <div title="Detected location">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
