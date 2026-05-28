import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import Header from './Header';
import BottomNav from './BottomNav';
import BusinessSwitcher from '../Business/BusinessSwitcher';
import InactivityModal from '../Inactivity/InactivityModal';
import UmwishingiziChat from '../AI/UmwishingiziChat';

const Layout = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const initActiveBusiness = useBusinessStore((s) => s.initActiveBusiness);

  useEffect(() => {
    initActiveBusiness();
  }, [initActiveBusiness]);

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg-body)' }}>
      <Header />
      <main className="px-4 mx-auto max-w-md pt-4">
        <BusinessSwitcher />
        <Outlet />
      </main>
      <BottomNav />
      <InactivityModal />

      <button
        type="button"
        onClick={() => setAiOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}
        aria-label="Open Umwishingizi AI"
      >
        <Bot className="w-7 h-7" />
      </button>
      <UmwishingiziChat open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
};

export default Layout;
