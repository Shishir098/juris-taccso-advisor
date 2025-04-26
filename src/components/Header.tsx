
import { JurisdictionSelector } from "./JurisdictionSelector";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">TAccSo Advisor</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <JurisdictionSelector />
        </div>
      </div>
    </header>
  );
}
