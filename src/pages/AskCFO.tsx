import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Send, Bot, User, Loader2 } from "lucide-react";
import api from "@/api/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const suggestedQuestions = [
  "What is our current financial health?",
  "What are the biggest risks we face?",
  "How can we improve our cash flow?",
  "What is our bankruptcy risk?",
  "Recommend a growth strategy",
  "Analyze our expense structure",
];

const AskCFO = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI CFO. I have full visibility into your company's financials — cash flow, revenue, expenses, fraud alerts, and risk indicators. Ask me anything about your financial health or strategy.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question?: string) => {
    const text = question ?? input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.get("/ask-cfo", {
        params: { question: text },
      });

      const aiMsg: Message = {
        role: "assistant",
        content: res.data.ai_cfo_analysis,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the backend. Make sure FastAPI is running on port 8000.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-[900px]">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">Ask CFO</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered financial advisor with full access to your data</p>
        </div>

        {/* Suggested Questions — only show when only 1 message (intro) */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant" ? "bg-primary/15" : "bg-secondary"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-4 h-4 text-primary" />
                  : <User className="w-4 h-4 text-muted-foreground" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "assistant"
                    ? "glass-card text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass-card p-3 flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your CFO anything... (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-32 overflow-y-auto"
            style={{ lineHeight: "1.5rem" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

export default AskCFO;