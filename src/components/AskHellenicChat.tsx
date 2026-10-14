import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const AskHellenicChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: "Welcome to the Hellenic Dental Clinic concept experience. I can help you explore our treatments, learn about our doctor specialists on Al Wasl Road, check clinic hours, or guide you through our demo appointment booking.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickActions = [
    { label: 'Explore Treatments', prompt: 'What treatment categories and aesthetic services does Hellenic Dental Clinic offer?' },
    { label: 'Book Appointment', prompt: 'How does the demo appointment booking process work?' },
    { label: 'Meet Our Doctors', prompt: 'Tell me about the clinic specialists and Clinical Director Dr. Eleni Tzomaa.' },
    { label: 'Clinic Hours', prompt: 'What are the opening hours and location on Al Wasl Road in Dubai?' },
    { label: 'Dental Implants', prompt: 'What is your approach to dental implant surgery and wisdom teeth?' },
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const res = await fetch('/api/ai-receptionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I am here to guide your concept experience at Hellenic Dental Clinic. Feel free to explore our treatments or book a demo visit.";

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        text: "Hellenic Dental Clinic is located on Al Wasl Road, Al Bada'a, Dubai, open Mon–Fri 09:30–20:00, Sat 09:30–19:00, and Sun 11:00–17:00. You can reach our reception at +971 4 349 0422 or use our Book Appointment page to test our scheduling engine.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-[#14294A] hover:bg-[#1762B2] text-white p-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/30"
          aria-label="Open Ask Hellenic AI Concierge"
        >
          <div className="relative">
            <img
              src="/assets/brand/hellenic-dental-symbol.jpg"
              alt="Hellenic Dental Logo"
              className="w-8 h-8 rounded-full object-cover border border-blue-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#14294A] rounded-full"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold tracking-wider uppercase text-blue-200">AI Concierge</span>
            <span className="block text-sm font-extrabold text-white">Ask Hellenic</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[420px] max-h-[85vh] h-[640px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#14294A] text-white p-4 flex items-center justify-between border-b border-blue-900/40">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-blue-400/40 shadow-sm">
                <img
                  src="/assets/brand/hellenic-dental-symbol.jpg"
                  alt="Hellenic Dental Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Ask Hellenic
                  </h3>
                  <span className="text-[10px] font-semibold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                    Gemini AI
                  </span>
                </div>
                <p className="text-xs text-blue-200">Dubai Reception &amp; Treatment Guide</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Medical & Demo Boundary Notice Banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-3.5 py-1.5 text-[11px] text-blue-900 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Concept assistant cannot diagnose medical conditions or quote binding fees.</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#14294A] text-blue-200'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-lg bg-[#14294A] text-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/70 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-400 ml-1">Consulting clinic knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qa.prompt)}
                className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-colors shrink-0"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about treatments, doctors, hours..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Booking Anchor CTA */}
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
            <span>Ready to test the booking flow?</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/book');
              }}
              className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <span>Launch Booking Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
