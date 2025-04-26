import { Jurisdiction } from "@/data/jurisdictions";

// This would normally be loaded from a backend service or database
// Here we're keeping it simple with a static mapping
const jurisdictionPrompts: Record<string, string> = {
  us: "Please provide advice according to United States law and regulations.",
  uk: "Please provide advice according to United Kingdom law and regulations.",
  ca: "Please provide advice according to Canadian law and regulations.",
  au: "Please provide advice according to Australian law and regulations.",
  eu: "Please provide advice according to European Union law and regulations.",
  de: "Please provide advice according to German law and regulations.",
  fr: "Please provide advice according to French law and regulations.",
  in: "Please provide advice according to Indian law and regulations.",
  jp: "Please provide advice according to Japanese law and regulations.",
  sg: "Please provide advice according to Singaporean law and regulations.",
};

// Default prompt addition if no jurisdiction is specified or found
const defaultJurisdictionPrompt = "Please note that legal advice may vary by jurisdiction.";

/**
 * Modifies the given prompt to include jurisdiction-specific legal context
 */
export function modifyPromptForJurisdiction(
  prompt: string,
  jurisdiction: Jurisdiction | null
): string {
  if (!jurisdiction) {
    return `${prompt}\n\n${defaultJurisdictionPrompt}`;
  }

  const jurisdictionPrompt = jurisdictionPrompts[jurisdiction.code] || defaultJurisdictionPrompt;
  
  // Add the jurisdiction context to the prompt
  return `${prompt}\n\n${jurisdictionPrompt}\nJurisdiction: ${jurisdiction.name}`;
}

/**
 * This would be used to intercept and modify API requests to the AI model
 * In a real implementation, this would connect to whatever API middleware you use
 */
export function prepareAPIRequest(
  originalRequest: any,
  jurisdiction: Jurisdiction | null
): any {
  // Deep clone the request to avoid mutating the original
  const modifiedRequest = JSON.parse(JSON.stringify(originalRequest));
  
  // Check if there's a system message we can modify
  if (modifiedRequest.messages && Array.isArray(modifiedRequest.messages)) {
    // Look for system messages
    const systemMessageIndex = modifiedRequest.messages.findIndex(
      (msg: any) => msg.role === "system"
    );
    
    if (systemMessageIndex >= 0) {
      // Modify existing system message
      modifiedRequest.messages[systemMessageIndex].content = modifyPromptForJurisdiction(
        modifiedRequest.messages[systemMessageIndex].content,
        jurisdiction
      );
    } else {
      // Add a new system message at the beginning
      modifiedRequest.messages.unshift({
        role: "system",
        content: jurisdictionPrompts[jurisdiction?.code || ""] || defaultJurisdictionPrompt
      });
    }
  }
  
  return modifiedRequest;
}
