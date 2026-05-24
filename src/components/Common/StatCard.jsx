const StatCard = ({ title, value, icon: Icon, color = 'green', subtitle, onClick }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const iconColors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-4 sm:p-5 text-left w-full transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${colorClasses[color] || colorClasses.green}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium opacity-75">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-[10px] sm:text-xs opacity-60">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColors[color] || iconColors.green}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </button>
  );
};

export default StatCard;
