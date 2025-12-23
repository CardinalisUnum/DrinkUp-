import React, { useState, useEffect } from 'react';
import { FluidBackgroundView } from './components/FluidBackgroundView';
import { HistoryView } from './components/HistoryView';
import { UserProfileView } from './components/UserProfileView';
import { DrinkUpColors, UIConstants } from './constants';
import { UserSettings, HydrationEntry } from './types';
import { NotificationManager } from './services/NotificationManager';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'history' | 'profile'>('home');

  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "User",
    dailyGoalML: UIConstants.defaultDailyGoalML,
    containerSizeML: UIConstants.defaultContainerSizeML,
    weightKg: 70,
    activityLevel: 'medium',
    notificationsEnabled: false,
    reminderFrequencyMinutes: 60,
    reminderStartTime: "09:00",
    reminderEndTime: "21:00",
  });

  const [entries, setEntries] = useState<HydrationEntry[]>([
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), mlAmount: 250, confidenceScore: 0.95, beforeImageId: '', afterImageId: '' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), mlAmount: 400, confidenceScore: 0.88, beforeImageId: '', afterImageId: '' },
  ]);

  const [currentHydrationML, setCurrentHydrationML] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTotal = entries
      .filter(entry => new Date(entry.timestamp) >= today)
      .reduce((sum, entry) => sum + entry.mlAmount, 0);
    setCurrentHydrationML(todayTotal);
  }, [entries]);

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    if (newSettings.notificationsEnabled) {
      const granted = await NotificationManager.requestPermission();
      if (granted) NotificationManager.startReminders(newSettings);
    } else {
      NotificationManager.stopReminders();
    }
  };

  const hydrationPercentage = Math.min(currentHydrationML / userSettings.dailyGoalML, 1.0);
  const remainingML = Math.max(userSettings.dailyGoalML - currentHydrationML, 0);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black text-white">
      {/* 1. Fluid Background Layer */}
      <FluidBackgroundView currentHydrationPercentage={hydrationPercentage} />

      {/* 2. Main Content Layer */}
      <main className="relative z-10 w-full h-full flex flex-col justify-between pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),20px)] px-6 pointer-events-none">
        
        {/* TOP: Brand & Date */}
        <header className="flex justify-between items-center opacity-80 pointer-events-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white/90">DrinkUp!</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
          </div>
        </header>

        {/* CENTER: The HUD (Head-Up Display) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10 pointer-events-auto">
          {/* Circular Progress Indicator Container */}
          <div className="relative flex flex-col items-center justify-center">
             
             {/* Glow backing */}
             <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full scale-150" />

             <h2 className="text-[14vh] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
               {Math.round(hydrationPercentage * 100)}<span className="text-[4vh] align-top text-cyan-400">%</span>
             </h2>
             
             <div className="mt-4 flex flex-col items-center space-y-1">
                <div className="px-4 py-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
                   <span className="text-sm font-mono text-cyan-100/80">
                      {currentHydrationML} / {userSettings.dailyGoalML} mL
                   </span>
                </div>
                {remainingML > 0 ? (
                  <span className="text-xs text-white/40 font-medium">
                    {remainingML} mL to target
                  </span>
                ) : (
                  <span className="text-xs text-green-400 font-bold tracking-widest uppercase glow-green">
                    Daily Goal Met
                  </span>
                )}
             </div>
          </div>
        </div>

        {/* BOTTOM: Navigation Dock */}
        <div className="w-full pointer-events-auto">
           <div className="relative mx-auto max-w-sm h-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between px-8">
              
              {/* Left: History */}
              <button 
                 onClick={() => setActiveView('history')}
                 className="flex flex-col items-center gap-1 group w-16"
              >
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeView === 'history' ? 'bg-cyan-500 text-black shadow-[0_0_15px_cyan]' : 'text-white/60 group-hover:bg-white/10 group-hover:text-white'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>
                 </div>
                 <span className="text-[9px] font-bold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">LOGS</span>
              </button>

              {/* Center: The Lens (Action Button) */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                <button
                  onClick={() => console.log("Camera trigger")}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95 z-20"
                >
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black border border-white/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]" />
                  
                  {/* Inner Glass */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-900/40 to-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
                     {/* Reflection glare */}
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                     <div className="w-6 h-6 border-2 border-white/80 rounded-sm opacity-80" />
                     <div className="absolute w-full h-[1px] bg-red-500/50 top-1/2" />
                     <div className="absolute h-full w-[1px] bg-red-500/50 left-1/2" />
                  </div>
                </button>
              </div>

              {/* Right: Profile */}
              <button 
                 onClick={() => setActiveView('profile')}
                 className="flex flex-col items-center gap-1 group w-16"
              >
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeView === 'profile' ? 'bg-cyan-500 text-black shadow-[0_0_15px_cyan]' : 'text-white/60 group-hover:bg-white/10 group-hover:text-white'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
                 <span className="text-[9px] font-bold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">BIO</span>
              </button>
           </div>
        </div>
      </main>

      {/* Overlays / Views */}
      {/* We keep these conditioned but animate them with CSS classes in the components */}
      {activeView === 'history' && (
        <HistoryView entries={entries} onClose={() => setActiveView('home')} />
      )}
      
      {activeView === 'profile' && (
        <UserProfileView settings={userSettings} onSave={handleUpdateSettings} onClose={() => setActiveView('home')} />
      )}
    </div>
  );
};

export default App;