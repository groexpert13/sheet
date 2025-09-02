'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Send, Bot, MessageSquare, Sparkles } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; content: string; at: number };

function getAuthEmail(): string | null {
  try {
    const raw = localStorage.getItem('authUser');
    if (!raw) return null;
    const { email } = JSON.parse(raw || '{}');
    return email || null;
  } catch {
    return null;
  }
}

function getLang(): string {
  try {
    return localStorage.getItem('site-lang') || 'ru';
  } catch {
    return 'ru';
  }
}

function getDiagnostic(): any {
  try {
    const raw = localStorage.getItem('diagnostic-data');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storageKey(email: string | null) {
  return `ai-chat:${email || 'anon'}`;
}

function usePersistentChat(email: string | null) {
  const key = storageKey(email);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(messages.slice(-40))); // keep last 40
    } catch {}
  }, [key, messages]);

  return { messages, setMessages } as const;
}

export default function AIAssistantPanel() {
  const email = typeof window !== 'undefined' ? getAuthEmail() : null;
  const lang = typeof window !== 'undefined' ? getLang() : 'ru';
  const { messages, setMessages } = usePersistentChat(email);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    const v = viewportRef.current;
    if (!v) return;
    v.scrollTop = v.scrollHeight;
  }, [messages, open]);

  // Keep diagnostic snapshot fresh within same tab (polling is simplest and robust)
  const latestDiagnosticRef = useRef<any>({});
  useEffect(() => {
    latestDiagnosticRef.current = getDiagnostic();
    const t = setInterval(() => {
      latestDiagnosticRef.current = getDiagnostic();
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const resetChat = useCallback(() => {
    try { localStorage.removeItem(storageKey(email)); } catch {}
    setMessages([]);
  }, [email, setMessages]);

  // Cross-tab and in-tab reset sync for AI chat
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'global-reset') resetChat();
    };
    window.addEventListener('storage', onStorage);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('app-events');
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'reset') resetChat();
      };
    } catch {}
    return () => {
      window.removeEventListener('storage', onStorage);
      try { bc?.close(); } catch {}
    };
  }, [resetChat]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: text, at: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    const assistantIndex = messages.length + 1; // after pushing user
    const assistantMsg: ChatMessage = { role: 'assistant', content: '', at: Date.now() };
    setMessages((prev) => [...prev, assistantMsg]);
    setSending(true);
    setStreamingId(assistantIndex);

    const payload = {
      messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
      diagnostic: latestDiagnosticRef.current,
      user: email,
      lang,
    };

    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.body) {
        throw new Error('No stream');
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const cur = [...prev];
          const idx = streamingId ?? cur.length - 1;
          if (!cur[idx] || cur[idx].role !== 'assistant') return cur;
          cur[idx] = { ...cur[idx], content: (cur[idx].content || '') + chunk };
          return cur;
        });
      }
    } catch (e: any) {
      setMessages((prev) => {
        const cur = [...prev];
        const idx = streamingId ?? cur.length - 1;
        if (cur[idx] && cur[idx].role === 'assistant') {
          cur[idx] = {
            ...cur[idx],
            content: (cur[idx].content || '') + `\n[connection-error] ${e?.message || 'failed'}`,
          };
        }
        return cur;
      });
    } finally {
      // If nothing was streamed, show a helpful fallback
      setMessages((prev) => {
        const cur = [...prev];
        const idx = streamingId ?? cur.length - 1;
        if (cur[idx] && cur[idx].role === 'assistant' && !cur[idx].content) {
          const langNow = getLang();
          const fallback = langNow === 'en'
            ? 'No visible output. The model may have refused or produced an empty response. Try rephrasing or ask a more specific question.'
            : langNow === 'uk'
            ? 'Немає вихідного тексту. Модель могла відмовити або повернути порожню відповідь. Спробуйте переформулювати або поставити більш конкретне питання.'
            : 'Нет текста ответа. Модель могла отказать или вернуть пустой ответ. Попробуйте переформулировать вопрос и уточнить контекст.';
          cur[idx] = { ...cur[idx], content: fallback };
        }
        return cur;
      });
      setSending(false);
      setStreamingId(null);
    }
  }, [email, lang, messages, sending, input]);

  // Minimal markdown rendering: paragraphs, lists, code fences, inline bold/italic
  const renderMarkdown = useCallback((text: string) => {
    // Escape basic HTML to avoid injection
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Code fences
    const codeRe = /```([\s\S]*?)```/g;
    let parts: (string | { code: string })[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = codeRe.exec(text))) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push({ code: m[1] });
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));

    return (
      <div className="space-y-3 text-sm leading-6">
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            <div key={i} dangerouslySetInnerHTML={{
              __html: esc(p)
                .replace(/^### (.*)$/gm, '<strong class="text-gray-900">$1</strong>')
                .replace(/^## (.*)$/gm, '<strong class="text-gray-900">$1</strong>')
                .replace(/^# (.*)$/gm, '<strong class="text-gray-900">$1</strong>')
                .replace(/^\- (.*)$/gm, '• $1')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br/>'),
            }} />
          ) : (
            <pre key={i} className="bg-gray-950/95 text-gray-100 p-3 rounded-md overflow-x-auto text-xs">
              <code>{p.code}</code>
            </pre>
          )
        )}
      </div>
    );
  }, []);

  const HeaderHint = useMemo(() => (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Badge variant="secondary" className="bg-gray-100">{email || 'guest'}</Badge>
      <span className="hidden sm:inline">Аналитика на основе текущих данных диагностики</span>
    </div>
  ), [email]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="shadow-lg rounded-full px-4">
            <Sparkles className="h-4 w-4 mr-2" /> AI
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 sm:w-[440px] w-[92vw]">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Bot className="h-4 w-4" /> MAOL AI
              </SheetTitle>
              {HeaderHint}
            </SheetHeader>

            <div ref={viewportRef} className="flex-1 overflow-auto p-4 space-y-3 bg-white">
              {messages.length === 0 && (
                <Card className="p-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Спросите про ваши данные</span>
                  </div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Где узкие места в воронке?</li>
                    <li>Что внедрить первым из инструментов?</li>
                    <li>Как достичь точку Б быстрее?</li>
                  </ul>
                </Card>
              )}

              {messages.map((m, idx) => (
                <div key={idx} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  )}>
                    {m.role === 'assistant' ? renderMarkdown(m.content) : <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={lang === 'uk' ? 'Ваше запитання…' : lang === 'en' ? 'Ask about your data…' : 'Ваш вопрос…'}
                  disabled={sending}
                />
                <Button onClick={send} disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-[10px] text-gray-500 text-right">
                Ответ формируется в реальном времени
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
