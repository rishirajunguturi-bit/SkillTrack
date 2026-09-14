'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User as UserIcon, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adaptiveService } from '@/services/adaptive.service';
import { toast } from 'sonner';

function formatMessageText(text: string): string {
  if (!text) return '';
  let cleaned = text;
  // Format math multiplication patterns e.g. 99 * 0 is **0** -> 99 × 0 = 0
  cleaned = cleaned.replace(/(\d+)\s*\*\s*(\d+)\s*is\s*\*\*(\d+)\*\*/gi, '$1 × $2 = $3');
  // Format inline LaTeX math ($O(\log n)$ -> `O(log n)`)
  cleaned = cleaned.replace(/\$([^$]+)\$/g, '`$1`');
  return cleaned;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface UsageState {
  requestsUsed: number;
  requestLimit: number;
  requestsRemaining: number;
  usagePercentage: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export function AiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageData, setUsageData] = useState<UsageState | null>(null);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your SkillTrack AI Assistant. Ask me anything about your skill gaps, assessment preparation, campus interviews, or computer science concepts!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch Usage Data on Drawer Open
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      adaptiveService
        .getAiUsage()
        .then((data) => setUsageData(data))
        .catch(() => {});
    }
  }, [messages, isOpen]);

  const sendQuery = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading || (usageData && usageData.requestsRemaining === 0)) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Prepare history payload for multi-turn conversation memory
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-6)
      .map((m) => ({ role: m.sender, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await adaptiveService.askAiAssistant(query, historyPayload);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (res.usage) {
        setUsageData(res.usage);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch AI response');
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputMessage);
  };

  const quickPrompts = [
    'What should I learn next?',
    'Explain my biggest skill gap',
    'How do I prepare for campus interviews?',
  ];

  const isLimitReached = usageData !== null && usageData.requestsRemaining === 0;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ask SkillTrack AI Assistant"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl transition-all transform hover:scale-105 cursor-pointer border border-purple-400/30"
        >
          <Sparkles className="h-4 w-4 text-purple-200 animate-pulse" />
          <span>Ask SkillTrack AI</span>
        </button>
      </div>

      {/* Assistant Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] rounded-2xl bg-[#1c132b] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-[#fff9fc]"
          >
            {/* Drawer Header */}
            <div className="p-3.5 px-4 bg-[#281a3a] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#fff9fc] flex items-center gap-1.5">
                    SkillTrack AI Mentor
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  </h3>
                  <p className="text-[10px] text-zinc-400">Context-aware conversational mentor</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Application-Level AI Usage Indicator Meter */}
            {usageData && (
              <div className="bg-[#221634] border-b border-zinc-800/80 px-3.5 py-2 text-[10.5px] space-y-1.5 shrink-0">
                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="font-bold text-purple-200">AI Usage</span>
                    <span className="text-zinc-600">•</span>
                    <span>
                      <strong className="text-white font-bold">{usageData.requestsUsed}</strong> / {usageData.requestLimit} today
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        isLimitReached
                          ? 'text-rose-400 font-bold'
                          : usageData.usagePercentage >= 80
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {isLimitReached ? 'Limit reached' : `${usageData.requestsRemaining} remaining`}
                    </span>
                    {usageData.totalTokens && usageData.totalTokens > 0 ? (
                      <button
                        onClick={() => setShowTokenDetails(!showTokenDetails)}
                        className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-0.5 text-[9.5px]"
                      >
                        <span>Details</span>
                        {showTokenDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isLimitReached
                        ? 'bg-rose-500'
                        : usageData.usagePercentage >= 80
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, usageData.usagePercentage)}%` }}
                  />
                </div>

                {/* Expandable Measured Token Details */}
                {showTokenDetails && usageData.totalTokens && usageData.totalTokens > 0 ? (
                  <div className="mt-1 pt-1 border-t border-purple-900/30 flex items-center justify-between text-[9.5px] text-zinc-400 font-mono">
                    <span>Input: {usageData.inputTokens?.toLocaleString()}</span>
                    <span>Output: {usageData.outputTokens?.toLocaleString()}</span>
                    <span className="text-purple-300 font-semibold">Total: {usageData.totalTokens?.toLocaleString()} tokens</span>
                  </div>
                ) : null}

                {/* Responsible Usage Tip */}
                <p className="text-[9.5px] text-zinc-400 italic flex items-center gap-1">
                  <Info className="h-3 w-3 text-purple-400 shrink-0" />
                  <span>Tip: Ask one complete question to get a better answer and use fewer AI requests.</span>
                </p>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="h-6 w-6 rounded-full bg-purple-600/40 text-purple-300 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[82%] space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-[#281a3a] text-zinc-200 border border-zinc-800 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div className="text-zinc-200 text-xs leading-relaxed overflow-hidden">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-purple-200">{children}</strong>,
                            em: ({ children }) => <em className="italic text-purple-300">{children}</em>,
                            code: ({ className, children, ...props }) => (
                              <code className="bg-purple-950/60 text-purple-300 border border-purple-800/40 px-1 py-0.5 rounded text-[11px] font-mono" {...props}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-[#181124] p-2.5 rounded-lg border border-purple-900/40 overflow-x-auto text-[11px] font-mono my-2 text-zinc-200">
                                {children}
                              </pre>
                            ),
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5">{children}</ol>,
                            li: ({ children }) => <li className="leading-snug">{children}</li>,
                            h1: ({ children }) => <h1 className="text-sm font-bold text-white mt-2 mb-1">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xs font-bold text-purple-200 mt-2 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-semibold text-purple-300 mt-1.5 mb-1">{children}</h3>,
                          }}
                        >
                          {formatMessageText(msg.text)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    )}
                    <span className="text-[9px] opacity-60 block text-right">{msg.timestamp}</span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  <span>Thinking & analyzing context...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-[#1c132b] flex gap-1.5 overflow-x-auto text-[10px]">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(prompt)}
                  disabled={isLoading || isLimitReached}
                  className="px-2.5 py-1 rounded-full bg-[#281a3a] text-purple-300 border border-purple-800/40 hover:bg-purple-900/40 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Limit Reached Warning Banner */}
            {isLimitReached && (
              <div className="px-3 py-2 bg-rose-950/60 border-t border-rose-900/50 text-rose-200 text-[10.5px] text-center font-medium">
                You've reached today's SkillTrack AI limit. Try again after your daily allowance resets.
              </div>
            )}

            {/* Input Box */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-[#281a3a] border-t border-zinc-800 flex gap-2">
              <Input
                placeholder={isLimitReached ? "Daily allowance reached..." : "Ask about skills, assessment scores, CS topics..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading || isLimitReached}
                className="text-xs bg-[#1c132b] border-zinc-700 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !inputMessage.trim() || isLimitReached}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
