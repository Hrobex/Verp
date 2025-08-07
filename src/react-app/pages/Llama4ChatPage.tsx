import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Copy, Edit2, Download, XCircle, Send, PlusCircle, ArrowLeft } from 'lucide-react';

// واجهة الرسالة لضمان التناسق
interface Message {
  id: string; // ID فريد لكل رسالة
  role: 'user' | 'assistant';
  content: string;
}

// دالة لإنشاء ID فريد
const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;


// ---------------------------------------------------------------
// --- المكون الرئيسي لواجهة الشات ---
// ---------------------------------------------------------------
function Llama4ChatPage() {
  // --- الحالات (States) ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- التأثيرات الجانبية (Effects) ---

  // لتحميل المحادثة من التخزين المحلي عند فتح الصفحة
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('llama4-chat-history');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
    }
  }, []);

  // لحفظ المحادثة في التخزين المحلي عند كل تغيير
  useEffect(() => {
    try {
      localStorage.setItem('llama4-chat-history', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to local storage", error);
    }
  }, [messages]);

  // للتمرير التلقائي للأسفل عند وصول رسالة جديدة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  // --- دوال التعامل مع الأحداث (Handlers) ---

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
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response.' }}));
        const errorMessage = `Error from API: ${errorData.error?.message || response.statusText}`;
        setMessages(currentMessages => {
            const updated = [...currentMessages];
            updated[updated.length - 1].content = errorMessage;
            return updated;
        });
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }
      
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
                setMessages(currentMessages => {
                  const updatedMessages = [...currentMessages];
                  const lastMsgIndex = updatedMessages.length - 1;
                  if (lastMsgIndex >= 0 && updatedMessages[lastMsgIndex].role === 'assistant') {
                    updatedMessages[lastMsgIndex].content = accumulatedResponse;
                  }
                  return updatedMessages;
                });
              }
            } catch (e) {
              console.error("Failed to parse stream data:", dataStr, e);
            }
          }
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(currentMessages => {
            const updatedMessages = [...currentMessages];
            const lastMsgIndex = updatedMessages.length - 1;
            if (lastMsgIndex >= 0 && updatedMessages[lastMsgIndex].role === 'assistant') {
              updatedMessages[lastMsgIndex].content = "A critical error occurred. Please check the connection.";
            }
            return updatedMessages;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const newUserMessage: Message = { role: 'user', content: input, id: generateUniqueId() };
    const updatedHistory = [...messages, newUserMessage];
    
    setMessages(updatedHistory);
    setInput('');
    handleSendMessage(input, updatedHistory);
  };

  const handleEdit = (id: string, newContent: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) return;

    const historyToResend = messages.slice(0, messageIndex + 1);
    historyToResend[messageIndex].content = newContent;
    
    setMessages(historyToResend);
    setEditingMessageId(null);
    handleSendMessage(newContent, historyToResend);
  };

  const handleDownload = () => {
    const conversation = messages.map(msg => `**${msg.role.toUpperCase()}**: \n${msg.content}`).join('\n\n---\n\n');
    const blob = new Blob([conversation], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llama-4-chat-history.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsLoading(false);
    }
  };


  return (
    <>
      <title>Llama-4 Chat Interface</title>
      <meta name="description" content="Start your conversation with the Llama-4 AI assistant. Ask questions, get answers, and explore the capabilities of our advanced AI." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://aiconvert.online/llama-4/chat" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/llama-4/chat" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/llama-4/chat" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/llama-4/chat" />
    
      <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
        <h1 className="sr-only">Llama-4 Chat Interface</h1>
        
        <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
          <Link to="/llama-4" className="p-2 hover:bg-gray-700 rounded-full" title="Back to Llama-4 Home">
            <ArrowLeft size={20}/>
          </Link>
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">
            Llama-4
          </div>
          <div className="flex gap-2">
              <button onClick={() => setMessages([])} className="p-2 hover:bg-gray-700 rounded-full" title="New Chat"><PlusCircle size={20}/></button>
              <button onClick={handleDownload} className="p-2 hover:bg-gray-700 rounded-full" title="Download Chat"><Download size={20}/></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onEdit={setEditingMessageId} />
          ))}
          {isLoading && (!messages.length || messages[messages.length-1].role === 'user') && (
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white animate-pulse">L4</div>
                <div className="max-w-xl p-4 rounded-xl bg-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-4 bg-gray-900 border-t border-gray-700">
          {isLoading && (
              <button onClick={stopGeneration} className="mx-auto mb-2 flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-full">
                  <XCircle size={16}/> Stop Generating
              </button>
          )}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Llama-4 anything..."
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              disabled={isLoading}
            />
            <button type="submit" className="p-3 bg-emerald-600 rounded-full hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
              <Send size={24} />
            </button>
          </form>
        </footer>

        {editingMessageId && (
          <EditModal 
              message={messages.find(m => m.id === editingMessageId)!} 
              onSave={handleEdit}
              onClose={() => setEditingMessageId(null)}
          />
        )}
      </div>
    </>
  );
}


const ChatMessage = ({ message, onEdit }: { message: Message, onEdit: (id: string) => void }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">L4</div>}
        <div className={`group relative max-w-2xl p-4 rounded-xl shadow-md ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <ReactMarkdown
            components={{
              code({ children }) {
                return (
                  <pre className="bg-gray-800/50 p-3 my-2 rounded-md overflow-x-auto text-sm">
                    <code>{String(children)}</code>
                  </pre>
                )
              },
              a({href, children}) {
                  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{children}</a>
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => navigator.clipboard.writeText(message.content)} className="p-1.5 hover:bg-gray-500/50 rounded" title="Copy"><Copy size={14}/></button>
            {isUser && <button onClick={() => onEdit(message.id)} className="p-1.5 hover:bg-gray-500/50 rounded" title="Edit & Resend"><Edit2 size={14}/></button>}
          </div>
        </div>
      </div>
    );
};

const EditModal = ({ message, onSave, onClose }: { message: Message, onSave: (id: string, newContent: string) => void, onClose: () => void }) => {
    const [editText, setEditText] = useState(message.content);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-2xl">
          <h3 className="text-lg font-bold mb-4">Edit Message</h3>
          <textarea 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-40 p-3 bg-gray-700 rounded-md mb-4 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            rows={5}
          />
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
            <button onClick={() => onSave(message.id, editText)} className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500">Save & Regenerate</button>
          </div>
        </div>
      </div>
    );
};

export default Llama4ChatPage;```
