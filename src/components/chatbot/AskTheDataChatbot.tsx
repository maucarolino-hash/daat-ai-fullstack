import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleResponses: Record<string, string> = {
  "churn": "Based on the current data, **Soylent** has the highest churn rate at 18.5% monthly, followed by Umbrella at 12.3%. Your churn rate sits at a healthy 4.2%, which is significantly below the industry average of 8%.",
  "acme": "**Acme Corp Weaknesses:**\n• Customer support response time: 48hrs (industry avg: 12hrs)\n• Limited mobile app functionality\n• No AI-powered features\n• Higher pricing tier with fewer features\n• Recent negative reviews about onboarding experience",
  "market": "The total addressable market (TAM) is currently valued at **$4.2B** with a 12.5% YoY growth rate. Your market share is 12.5%, ranking 5th among competitors.",
  "risk": "Current risk assessment shows **Moderate** level:\n• High CAC detected ($245 vs industry $180)\n• Customer retention showing slight decline (-2%)\n• New competitor entry in Q3 2024",
  "default": "I can help you analyze your competitive data. Try asking about:\n• Competitor weaknesses (e.g., 'What are Acme's weak points?')\n• Churn rates\n• Market share trends\n• Risk factors"
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("churn")) return sampleResponses.churn;
  if (q.includes("acme") || q.includes("weak")) return sampleResponses.acme;
  if (q.includes("market") || q.includes("share") || q.includes("tam")) return sampleResponses.market;
  if (q.includes("risk")) return sampleResponses.risk;
  return sampleResponses.default;
}

export function AskTheDataChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI data analyst. Ask me anything about your competitive intelligence data. For example:\n• 'Which competitor has the highest churn?'\n• 'Summarize Acme Corp's weaknesses'\n• 'What's our market position?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group",
          "bg-gradient-to-br from-accent to-neon-blue shadow-lg hover:shadow-xl",
          "hover:scale-110 cyber-glow",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Ask the Data"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 h-[500px] rounded-2xl overflow-hidden transition-all duration-300 transform",
          "glass-card border border-accent/30 shadow-2xl flex flex-col",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ boxShadow: "0 0 40px hsl(271 91% 65% / 0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-neon-blue flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Ask the Data</h3>
            <p className="text-xs text-muted-foreground">AI-powered insights</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === "assistant"
                      ? "bg-accent/20"
                      : "bg-primary/20"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-accent" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3 text-sm",
                    message.role === "assistant"
                      ? "bg-secondary text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-secondary/20">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your data..."
              className="flex-1 bg-background border-border focus:border-accent"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}