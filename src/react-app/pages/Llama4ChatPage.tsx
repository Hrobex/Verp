import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Copy, Edit2, Download, XCircle, Send, Settings, Trash2, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ChatMessage = ({ message, onEdit }: { message: Message; onEdit: (id: string) => void }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">L4</div>}
      <div className={`group relative max-w-2xl lg:max-w-3xl px-4 py-3 rounded-xl shadow-md ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <ReactMarkdown
          components={{
            code({ children }) {
              return (
                <pre className="bg-gray-800/50 p-3 my-2 rounded-md overflow-x-auto text-sm">
                  <code>{String(children)}</code>
                </pre>
              );
            },
            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{children}</a>
          }}
        >
          {message.content}
        </ReactMarkdown>
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => navigator.clipboard.writeText(message.content)} className="p-1.5 hover:bg-black/20 rounded-md" title="Copy"><Copy size={14}/></button>
          {isUser && <button onClick={() => onEdit(message.id)} className="p-1.5 hover:bg-black/20 rounded-md" title="Edit & Resend"><Edit2 size={14}/></button>}
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ message, onSave, onClose }: { message: Message; onSave: (id: string, newContent: string) => void; onClose: () => void }) => {
  const [editText, setEditText] = useState(message.content);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-2xl">
        <h3 className="text-lg font-bold mb-4">Edit Message</h3>
        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full h-40 p-3 bg-gray-700 rounded-md mb-4" rows={5} />
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
          <button onClick={() => onSave(message.id, editText)} className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500">Save & Regenerate</button>
        </div>
      </div>
    </div>
  );
};

function Llama4ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try { const saved = localStorage.getItem('llama4-chat-history'); if(saved) setMessages(JSON.parse(saved)); } catch (e) {}
  }, []);
  useEffect(() => {
    const messagesToSave = messages.filter(m => !(m.role === 'assistant' && m.content === ''));
    if(messagesToSave.length > 0) localStorage.setItem('llama4-chat-history', JSON.stringify(messagesToSave));
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = useCallback(async (content: string, history: Message[]) => {
    if (isLoading || !content.trim()) return;
    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    const newHistory = [...history, { role: 'assistant' as const, content: '', id: generateUniqueId() }];
    setMessages(newHistory);
    try {
      const response = await fetch('/api/llama-4-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({id, ...rest}) => rest) }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse server error.' }}));
        throw new Error(errorData.error?.message || response.statusText);
      }
      
      if (!response.body) throw new Error('Response body is null');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr.trim() === '[DONE]') return;
            try {
              const data = JSON.parse(dataStr);
              const delta = data.choices[0]?.delta?.content || '';
              if (delta) {
                accumulatedResponse += delta;
                setMessages(current => {
                  const updated = [...current];
                  updated[updated.length - 1].content = accumulatedResponse;
                  return updated;
                });
              }
            } catch (e) { /* ignore */ }
          }
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(current => {
          const updated = [...current];
          updated[updated.length - 1].content = `**Error:** ${error.message}`;
          return updated;
        });
      }
    } finally { setIsLoading(false); abortControllerRef.current = null; }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newUserMessage = { role: 'user' as const, content: input, id: generateUniqueId() };
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setInput('');
    handleSendMessage(input, updatedHistory);
  };

  const handleEdit = (id: string, newContent: string) => {
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;
    const history = messages.slice(0, msgIndex + 1);
    history[msgIndex].content = newContent;
    setMessages(history);
    setEditingMessageId(null);
    handleSendMessage(newContent, history);
  };

  const handleDownload = () => {
    const text = messages.map(m => `### ${m.role.toUpperCase()}\n\n${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llama-4-chat.md';
    a.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };
  
  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem('llama4-chat-history');
    setIsMenuOpen(false);
  }

  const stopGeneration = () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };

  return (
    <>
      <title>Llama-4 Chat Interface</title>
      <meta name="description" content="Start your conversation with the Llama-4 AI assistant." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://aiconvert.online/llama-4/chat" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/llama-4/chat" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/llama-4/chat" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/llama-4/chat" />
      
      <div className="flex flex-col bg-gray-900 text-white font-sans relative" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <h1 className="sr-only">Llama-4 Chat Interface</h1>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => ( <ChatMessage key={msg.id} message={msg} onEdit={setEditingMessageId} /> ))}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0">
          {isLoading && (
              <button onClick={stopGeneration} className="mx-auto mb-2 flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-full">
                  <XCircle size={16}/> Stop Generating
              </button>
          )}
          <div className="relative max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Llama-4 anything..." className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-full" disabled={isLoading}/>
              <button 
  type="submit" 
  className="p-3 bg-emerald-600 rounded-full" 
  disabled={isLoading || !input.trim()}
  aria-label="Send Message"
>
  <Send size={24} />
</button>
                      </form>
            <div className="absolute right-0 -bottom-10">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400 hover:text-white" title="Options">
                <Settings size={20} />
              </button>
            </div>
            {isMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                    <button onClick={() => navigate('/llama-4')} className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-700 rounded-t-lg">
                        <ArrowLeft size={16} /> Return to previous page
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-700">
                        <Download size={16} /> Download Chat
                    </button>
                    <button onClick={handleNewChat} className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-700 rounded-b-lg text-red-400">
                        <Trash2 size={16} /> Start New Chat
                    </button>
                </div>
            )}
          </div>
        </footer>

        {editingMessageId && ( <EditModal message={messages.find(m => m.id === editingMessageId)!} onSave={handleEdit} onClose={() => setEditingMessageId(null)} /> )}
      </div>
    </>
  );
}

export default Llama4ChatPage;
