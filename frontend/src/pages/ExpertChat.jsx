import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot } from 'lucide-react';
import { chatbotApi } from '../api/endpoints.js';

export default function ExpertChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Farming Assistant. Ask me about crop diseases, weather, fertilizers, or market prices.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const mutation = useMutation({
    mutationFn: chatbotApi.send,
    onSuccess: ({ data }) => {
      setMessages((prev) => [...prev, { role: 'assistant', text: data.data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I could not reach the assistant service right now.' }]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    mutation.mutate({ message: input, history: messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text })) });
    setInput('');
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-3xl flex-col">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">AI Chat Assistant</h1>
      <div className="card mt-4 flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-wheat/10 dark:text-wheat">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-forest text-sage-50' : 'bg-sage-100 text-forest dark:bg-white/5 dark:text-sage-100'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex items-center gap-2 border-t border-sage-200 p-3 dark:border-white/10">
          <input
            className="input"
            placeholder="Ask about a crop disease, weather, fertilizer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="btn-primary !px-4 !py-3" onClick={send} disabled={mutation.isPending}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
