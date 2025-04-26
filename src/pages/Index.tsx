
import { useState } from "react";
import { useJurisdiction } from "@/contexts/JurisdictionContext";
import { modifyPromptForJurisdiction } from "@/services/promptService";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Index = () => {
  const { currentJurisdiction } = useJurisdiction();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an actual API call to an LLM
      // Here we're just simulating a response that includes the jurisdiction
      
      // Modify the prompt based on jurisdiction
      const modifiedPrompt = modifyPromptForJurisdiction(input, currentJurisdiction);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock response that acknowledges the jurisdiction
      const responseContent = `[Response based on ${currentJurisdiction.name} jurisdiction]\n\nHere's some legal advice related to your query. Please note that this is AI-generated advice and should not substitute professional legal counsel in ${currentJurisdiction.name}.`;
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: responseContent
      }]);
      
      console.log("Modified prompt sent to API:", modifiedPrompt);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-card shadow-sm border mb-6 p-6">
          <h2 className="text-2xl font-bold mb-2">TAccSo Legal Advisor</h2>
          <p className="text-muted-foreground">
            Get legal advice tailored to your jurisdiction: {" "}
            <span className="font-medium text-foreground">
              {currentJurisdiction.flag} {currentJurisdiction.name}
            </span>
          </p>
        </Card>
        
        <div className="space-y-6 mb-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Ask a legal question</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your question will be answered according to {currentJurisdiction.name} laws and regulations.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary/10 ml-8"
                    : "bg-muted mr-8 border"
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === "user" ? "You" : "TAccSo Assistant"}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="bg-muted p-4 rounded-lg mr-8 border">
              <div className="font-medium mb-1">TAccSo Assistant</div>
              <div className="animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Index;
