import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Bot, Send, Mic, X, Volume2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
];

const QUICK_ACTIONS = [
  { label: '💰 Tax Summary', query: 'Show me my tax summary' },
  { label: '📊 Sales Report', query: 'Show me my sales report' },
  { label: '⚠️ Pending Taxes', query: 'What taxes are pending?' },
  { label: '📈 Insights', query: 'Give me business insights' },
];

const AiAssistant = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: getWelcomeMessage(user?.language || 'en') },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  function getWelcomeMessage(lang) {
    const msgs = {
      en: "Hello! I'm Umwishingizi, your AI tax assistant. How can I help you today?",
      rw: "Muraho! Ndi Umwishingizi, umufasha wawe w'ubuhanga. Ndagufasha iki?",
      fr: "Bonjour! Je suis Umwishingizi, votre assistant fiscal IA. Comment puis-je vous aider?",
    };
    return msgs[lang] || msgs.en;
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: text, language });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || data.message || 'I understand.' }]);
      if (data.reply) speakText(data.reply, language);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'rw' ? 'rw-RW' : lang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'rw' ? 'rw-RW' : language === 'fr' ? 'fr-FR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-green-600" />
          <h1 className="text-lg font-bold text-slate-800">Umwishingizi</h1>
        </div>
        <div className="flex gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition ${
                language === l.code ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {l.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 ${
              msg.role === 'user'
                ? 'bg-green-600 text-white rounded-br-sm'
                : 'bg-white border border-slate-200 rounded-bl-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => speakText(msg.content, language)}
                  className="mt-1 p-1 rounded hover:bg-slate-100 transition"
                >
                  <Volume2 className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.query)}
              className="p-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition text-center"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask Umwishingizi..."
          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
        />
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          className={`p-2.5 rounded-xl transition ${
            isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || loading}
          className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
