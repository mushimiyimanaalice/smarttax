import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { 
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowLeft, Building2, HelpCircle, ChevronRight, MessageSquare 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const SOCKET_SERVER = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const UmwishingiziChat = ({ open, onClose }) => {
  if (!open) return null;

  const { t, i18n } = useTranslation();
  const { user, token } = useAuthStore();
  const activeBusinessId = user?.activeBusinessId || user?.businessId;

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(i18n.language),
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Quick Action chips
  const quickActions = [
    { label: i18n.language === 'rw' ? 'Imisoro yanjye' : i18n.language === 'fr' ? 'Mes impôts' : 'Show my taxes', query: 'Show my taxes' },
    { label: i18n.language === 'rw' ? 'Ibyagurishijwe uyu munsi' : i18n.language === 'fr' ? "Ventes d'aujourd'hui" : 'Today sales', query: 'Today sales' },
    { label: i18n.language === 'rw' ? 'Kora raporo' : i18n.language === 'fr' ? 'Générer un rapport' : 'Generate report', query: 'Generate report' },
    { label: i18n.language === 'rw' ? 'Imisoro itegereje' : i18n.language === 'fr' ? 'Taxes en attente' : 'Pending taxes', query: 'Pending taxes' },
    { label: i18n.language === 'rw' ? 'Ishyura umusoro' : i18n.language === 'fr' ? 'Payer mon impôt' : 'Pay my tax', query: 'Pay my tax' },
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Establish real-time Socket.io connection
  useEffect(() => {
    if (!token) return;

    const socketInstance = io(SOCKET_SERVER, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      setIsSocketConnected(true);
      if (user?.id || user?._id) {
        socketInstance.emit('join', { userId: user.id || user._id });
      }
    });

    socketInstance.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socketInstance.on('ai:reply', (data) => {
      setIsTyping(false);
      if (data && data.reply) {
        handleIncomingMessage(data.reply);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user]);

  // Speech Recognition setup (Voice-to-Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Select speech language based on active application language
      rec.lang = i18n.language === 'rw' ? 'rw-RW' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setInputText(transcript);
          sendMessage(transcript);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [i18n.language]);

  function getWelcomeMessage(lang) {
    switch (lang) {
      case 'rw':
        return 'Muraho! Nitwa Umwishingizi, umufasha wawe mu by’imisoro, ibicuruzwa n’ibarurishamibare. Nabafasha iki uyu munsi? 👋';
      case 'fr':
        return "Bonjour! Je suis Umwishingizi, votre assistant SmartTax. Je peux vous aider avec vos ventes, taxes, factures et rapports. Que puis-je faire pour vous aujourd'hui? 👋";
      default:
        return "Hello! I'm Umwishingizi, your friendly SmartTax AI assistant. Ask me about your sales, taxes, invoices, or business performance. How can I help you today? 👋";
    }
  }

  // Handle TTS output (Text-to-Speech)
  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel(); // Stop any currently speaking voice
      const cleanText = text.replace(/[*#_]/g, ''); // Strip Markdown syntax for clean speech
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Adapt language and choose suitable native voices
      if (i18n.language === 'rw') {
        utterance.lang = 'en-ZA'; // Fallback to South African accent if Kinyarwanda is missing
      } else if (i18n.language === 'fr') {
        utterance.lang = 'fr-FR';
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  };

  const handleIncomingMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      role: 'assistant',
      content: text,
      timestamp: new Date()
    }]);
    speakText(text);
  };

  // Submit message to AI (via Socket.io with HTTP fallback)
  const sendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append user message
    const userMsg = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const payload = {
      message: text,
      language: i18n.language,
      businessId: activeBusinessId,
      userId: user?.id || user?._id
    };

    // 1. Try real-time Socket.io
    if (isSocketConnected && socket) {
      socket.emit('ai:chat', payload, (response) => {
        if (!response || !response.ok) {
          // Socket callback error, trigger HTTP fallback
          fallbackToHttp(payload);
        }
      });
    } else {
      // 2. Fall back to HTTP POST endpoint
      await fallbackToHttp(payload);
    }
  };

  const fallbackToHttp = async (payload) => {
    try {
      const response = await api.post('/ai/chat', payload);
      setIsTyping(false);
      if (response.data && response.data.reply) {
        handleIncomingMessage(response.data.reply);
      }
    } catch (error) {
      setIsTyping(false);
      const errMsg = i18n.language === 'rw' 
        ? 'Ntabwo nshoboye kubona igisubizo nonaha. Hamagara nyuma cyangwa urebe internet.'
        : i18n.language === 'fr'
        ? "Impossible de me connecter à l'assistant. Veuillez vérifier votre connexion."
        : 'Sorry, I am having trouble connecting to my brain. Please check your connection and try again.';
      
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: errMsg,
        timestamp: new Date()
      }]);
    }
  };

  // Voice Hold-To-Talk functions
  const handleVoiceStart = (e) => {
    e.preventDefault();
    if (recognitionRef.current) {
      try {
        window.speechSynthesis.cancel(); // Stop talking when user starts speaking
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    } else {
      alert(
        i18n.language === 'rw' 
          ? 'Amawi ntabwo yashizwe muri ubu buryo bwa PWA.' 
          : 'Voice input is not supported or permission is denied on this browser.'
      );
    }
  };

  const handleVoiceEnd = (e) => {
    e.preventDefault();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Speech recognition stop failed:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-theme-card md:max-w-md md:mx-auto md:shadow-2xl md:border-x border-theme">
      {/* Premium WhatsApp-style Dark Green Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-green-800 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/10">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-700 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-base leading-tight">Umwishingizi</h2>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-xs text-green-200">
              {isTyping ? (
                <span className="italic animate-pulse">
                  {i18n.language === 'rw' ? 'Kwandika...' : i18n.language === 'fr' ? 'Écrit...' : 'Typing...'}
                </span>
              ) : (
                i18n.language === 'rw' ? 'Kuri murongo' : i18n.language === 'fr' ? 'En ligne' : 'Online'
              )}
            </p>
          </div>
        </div>

        {/* Audio Mute/Unmute toggle & Close Button */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const nextVal = !voiceEnabled;
              setVoiceEnabled(nextVal);
              if (!nextVal) window.speechSynthesis.cancel();
            }}
            className="p-2 rounded-full hover:bg-green-800 transition shrink-0"
            title="Toggle Voice Response"
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-green-300" />}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-green-800 transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#efeae2] dark:bg-[#1e293b] relative">
        <div className="text-center my-2">
          <span className="text-[11px] bg-white/75 dark:bg-gray-700/75 text-gray-500 dark:text-gray-300 px-2.5 py-1 rounded-md shadow-sm border border-gray-200/50 dark:border-gray-600/50">
            {i18n.language === 'rw' ? 'Ibiganiro birinzwe muri SmartTax' : i18n.language === 'fr' ? 'Chiffrement sécurisé SmartTax' : 'End-to-end secure SmartTax assistant'}
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-1.5`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div 
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-sm leading-relaxed text-sm ${
                  isUser 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-theme-card text-theme-primary rounded-bl-none border border-theme'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                <p className={`text-[10px] text-right mt-1.5 ${isUser ? 'text-green-200' : 'text-theme-secondary'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-theme-card px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-theme flex gap-1 items-center shrink-0">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="bg-theme-card border-t border-theme py-2.5 px-3 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none shrink-0">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(action.query)}
            className="px-3.5 py-1.5 bg-theme-card border border-theme text-theme-primary rounded-full text-xs font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-900/30 transition shrink-0 shadow-sm"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input Field & Microphone Actions Bar */}
      <div className="bg-theme-card border-t border-theme px-3 py-3 flex items-center gap-2.5 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }} 
          className="flex-1 flex items-center bg-theme-input border border-theme rounded-full px-4.5 py-1.5 focus-within:border-green-500 transition"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              i18n.language === 'rw' 
                ? 'Baza Umwishingizi...' 
                : i18n.language === 'fr' 
                ? 'Demander à Umwishingizi...' 
                : 'Ask Umwishingizi...'
            }
            className="flex-1 bg-transparent border-0 outline-none py-1.5 text-sm text-theme-primary placeholder-theme-secondary"
          />
          {inputText.trim() && (
            <button
              type="submit"
              className="p-1 text-green-600 hover:text-green-800 transition shrink-0"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Real-time Voice Hold-To-Talk Button */}
        <button
          type="button"
          onMouseDown={handleVoiceStart}
          onMouseUp={handleVoiceEnd}
          onTouchStart={handleVoiceStart}
          onTouchEnd={handleVoiceEnd}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-md shrink-0 cursor-pointer ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse scale-110' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          title="Hold to Talk"
          aria-label="Voice Assistant"
        >
          <Mic className="w-5.5 h-5.5" />
        </button>
      </div>

      {/* Hold-to-Talk HUD Overlay when active */}
      {isListening && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 animate-ping duration-1000">
            <Mic className="w-12 h-12 text-white" />
          </div>
          <p className="text-lg font-semibold mb-2">
            {i18n.language === 'rw' ? 'Ndakumva... Vuga nonaha' : i18n.language === 'fr' ? 'Je vous écoute... Parlez' : 'Listening... Speak now'}
          </p>
          <p className="text-sm text-gray-300">
            {i18n.language === 'rw' ? 'Rekura buto niba urangije' : i18n.language === 'fr' ? 'Relâchez pour envoyer' : 'Release button to send'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UmwishingiziChat;
