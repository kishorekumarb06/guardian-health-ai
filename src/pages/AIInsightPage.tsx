import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Send, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAiAnalysis, sendAiChatMessage, USER_ID } from "@/lib/api";
import { BottomNav } from "@/components/health/BottomNav";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    text: string;
}

const AIInsightPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const { data: analysis, isLoading: isAnalyzing } = useQuery({
        queryKey: ['ai-analysis', USER_ID],
        queryFn: () => fetchAiAnalysis(USER_ID)
    });

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: userMessage };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch(`http://localhost:3000/api/ai`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Network response was not ok");
            }

            const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: "ai", text: data.reply };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: any) {
            const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: "ai", text: err.message || "Error reaching AI" };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return "text-emerald-500";
        if (score < 60) return "text-amber-500";
        return "text-rose-500";
    };

    const getRiskBgColor = (score: number) => {
        if (score < 30) return "bg-emerald-500/10";
        if (score < 60) return "bg-amber-500/10";
        return "bg-rose-500/10";
    };

    const getRiskBorderColor = (score: number) => {
        if (score < 30) return "border-emerald-500";
        if (score < 60) return "border-amber-500";
        return "border-rose-500";
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center">
                <Sparkles className="h-10 w-10 text-primary animate-pulse mb-4" />
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Analyzing health data...</p>
            </div>
        );
    }

    const riskScore = analysis?.riskScore || 0;
    const status = analysis?.status || "Unknown";

    return (
        <div className="min-h-screen bg-background flex flex-col pb-[72px]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 py-[max(env(safe-area-inset-top),1rem)] medical-gradient">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
                        <ArrowLeft className="h-4 w-4 text-foreground" />
                    </button>
                    <div>
                        <h1 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Health Assistant
                        </h1>
                        <p className="text-[10px] text-muted-foreground">Powered by Guardian RAG Knowledge Base</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-6">

                {riskScore >= 60 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 bg-rose-500 text-white p-4 rounded-xl shadow-md border border-rose-600 flex items-start gap-3"
                    >
                        <AlertTriangle className="h-6 w-6 shrink-0 inline-block" />
                        <div>
                            <p className="font-bold text-sm">⚠️ High Risk Detected</p>
                            <p className="text-xs opacity-90 mt-0.5">Contact emergency services or your primary care provider immediately based on your recent vitals.</p>
                        </div>
                    </motion.div>
                )}

                {/* Risk Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 rounded-2xl border-2 p-5 ${getRiskBorderColor(riskScore)} ${getRiskBgColor(riskScore)} relative overflow-hidden`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Health Risk Score</p>
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                Status: {status}
                                {riskScore >= 60 && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                                {riskScore < 30 && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                            </h2>
                        </div>

                        <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${getRiskBorderColor(riskScore)} bg-card shadow-sm`}>
                            <span className={`text-xl font-extrabold ${getRiskColor(riskScore)}`}>{riskScore}</span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-4 text-sm font-medium text-foreground">
                        {analysis?.advice}
                    </div>

                    <Activity className={`absolute -bottom-4 -right-4 h-32 w-32 opacity-[0.03] ${getRiskColor(riskScore)}`} />
                </motion.div>

                {/* Safety Note */}
                <div className="mb-6 flex justify-center">
                    <span className="bg-accent text-accent-foreground text-[10px] px-3 py-1 rounded-full text-center max-w-[80%] leading-relaxed">
                        ⚠️ This AI assistant does not replace professional medical advice. If experiencing a medical emergency, call emergency services.
                    </span>
                </div>

                {/* Chat Interface */}
                <div className="space-y-4 mb-4">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-card border border-border text-foreground rounded-tl-sm"
                                    }`}
                            >
                                {msg.sender === "ai" && (
                                    <div className="flex items-center gap-1.5 mb-1 opacity-70">
                                        <Sparkles className="h-3 w-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Guardian AI</span>
                                    </div>
                                )}
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-[56px] bg-background border-t border-border p-4 z-40 pb-safe">
                <div className="flex items-center gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a medical question..."
                        className="flex-1 bg-accent border border-border rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-primary rounded-full text-primary-foreground disabled:opacity-50 transition-transform active:scale-95"
                    >
                        <Send className="h-4 w-4 ml-0.5" />
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default AIInsightPage;
