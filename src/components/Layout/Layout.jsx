// src/components/Layout/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Header from './Header';
import BottomNav from './BottomNav';
import BusinessSwitcher from '../Business/BusinessSwitcher';
import InactivityModal from '../Inactivity/InactivityModal';
import UmwishingiziChat from '../AI/UmwishingiziChat';

const Layout = () => {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="px-4 mx-auto max-w-md">
        <BusinessSwitcher />
        <Outlet />
      </main>
      <BottomNav />
      <InactivityModal />

      <button
        type="button"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
        aria-label="Open Umwishingizi AI"
      >
        <Bot className="w-7 h-7" />
      </button>
      <UmwishingiziChat open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
};

export default Layout;