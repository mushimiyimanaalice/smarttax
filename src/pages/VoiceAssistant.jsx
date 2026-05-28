import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Mic, MicOff, Volume2, Bot, Loader } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', voice: 'en-US' },
  { code: 'rw', label: 'Kinyarwanda', voice: 'rw-RW' },
  { code: 'fr', label: 'Français', voice: 'fr-FR' },
];

const VoiceAssistant = () => {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState(user?.language || 'en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition requires Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
    recognition.lang = langConfig.voice;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = event.results[event.results.length - 1];
      const text = current[0].transcript;
      setTranscript(text);
      if (current.isFinal) {
        handleVoiceQuery(text);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript('Error recognizing speech. Please try again.');
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript('');
    setResponse('');
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceQuery = async (text) => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: text, language });
      const reply = data.reply || data.message || 'I understand.';
      setResponse(reply);
      speakText(reply);
    } catch (err) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
      utterance.lang = langConfig.voice;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center">
        <Bot className="w-16 h-16 text-green-600 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-theme-primary">Voice Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">Hold the button and speak to Umwishingizi</p>
      </div>

      <div className="flex gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              language === l.code ? 'bg-green-600 text-white' : 'bg-slate-100 text-theme-secondary'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50'
            : 'bg-green-600 hover:bg-green-700 shadow-lg'
        }`}
      >
        {isListening ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>

      <p className="text-sm text-slate-500">
        {isListening ? 'Listening...' : 'Press and hold to speak'}
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm">Processing...</span>
        </div>
      )}

      {transcript && (
        <div className="w-full max-w-md bg-theme-card rounded-xl border border-theme p-4">
          <p className="text-xs text-slate-400 mb-1">You said:</p>
          <p className="text-sm text-theme-primary">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="w-full max-w-md bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-600 font-medium">Umwishingizi</p>
            <button onClick={() => speakText(response)} className="ml-auto p-1 rounded hover:bg-green-100">
              <Volume2 className="w-4 h-4 text-green-600" />
            </button>
          </div>
          <p className="text-sm text-theme-primary">{response}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
