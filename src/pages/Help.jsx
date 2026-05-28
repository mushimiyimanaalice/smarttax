import { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I register my business?', a: 'Go to the registration page, fill in your business details, and submit. A sector admin will review and approve your business.' },
    { q: 'How do I pay taxes?', a: 'Go to Taxes > Pending Taxes, select the tax you want to pay, and choose Mobile Money or Card payment.' },
    { q: 'What is my VAT rate?', a: 'The standard VAT rate in Rwanda is 18%. Some goods and services qualify for reduced rates.' },
    { q: 'How does offline mode work?', a: 'Sales made offline are saved locally on your device and automatically synced when you reconnect to the internet.' },
    { q: 'How do I switch businesses?', a: 'Use the business switcher in the header dropdown, or go to Switch Business from the navigation menu.' },
    { q: 'What is Umwishingizi?', a: 'Umwishingizi is your AI tax assistant. It can answer tax questions, provide insights, and help with business analysis.' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-theme-primary">Help & Support</h1>

      <div className="bg-theme-card rounded-xl border border-theme p-4">
        <h2 className="text-sm font-semibold text-theme-primary mb-3">Contact Us</h2>
        <div className="space-y-3">
          <a href="mailto:support@smarttax.rw" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition">
            <Mail className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Email</p>
              <p className="text-xs text-slate-500">support@smarttax.rw</p>
            </div>
          </a>
          <a href="tel:+250788000000" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Phone</p>
              <p className="text-xs text-slate-500">+250 788 000 000</p>
            </div>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Live Chat</p>
              <p className="text-xs text-slate-500">Chat with Umwishingizi</p>
            </div>
          </a>
        </div>
      </div>

      <div className="bg-theme-card rounded-xl border border-theme p-4">
        <h2 className="text-sm font-semibold text-theme-primary mb-3">Frequently Asked Questions</h2>
        <div className="space-y-1">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition"
              >
                <span className="text-sm font-medium text-slate-700">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="px-3 pb-3">
                  <p className="text-sm text-slate-500">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
