import { useEffect, useState } from 'react';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';

const BusinessSwitcher = () => {
  const { businesses, activeBusiness, fetchBusinesses, switchBusiness, initActiveBusiness } =
    useBusinessStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initActiveBusiness();
  }, []);

  const handleSwitch = async (id) => {
    await switchBusiness(id);
    setOpen(false);
    window.location.reload();
  };

  if (businesses.length <= 1 && !activeBusiness) return null;

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="font-medium text-gray-800 truncate">
            {activeBusiness?.name || 'Select business'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {businesses.map((b) => (
            <button
              key={b._id}
              type="button"
              onClick={() => handleSwitch(b._id)}
              className={`w-full text-left px-4 py-3 hover:bg-green-50 border-b last:border-0 ${
                activeBusiness?._id === b._id ? 'bg-green-50 text-green-700' : ''
              }`}
            >
              <p className="font-medium truncate">{b.name}</p>
              <p className="text-xs text-gray-500 capitalize">{b.status?.replace('_', ' ')}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessSwitcher;
