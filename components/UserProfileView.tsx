import React, { useState } from 'react';
import { UserSettings, ActivityLevel } from '../types';
import { DrinkUpColors } from '../constants';

interface UserProfileViewProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);

  const handleChange = (field: keyof UserSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Helper for activity Level selector
  const ActivityOption = ({ level, label }: { level: ActivityLevel, label: string }) => (
    <button 
      onClick={() => handleChange('activityLevel', level)}
      className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
        formData.activityLevel === level 
          ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
          : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
      
      {/* Top Bar */}
      <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose}>
        <div className="w-12 h-1.5 rounded-full bg-white/20" />
      </div>

      <div className="px-6 pb-4 flex justify-between items-center border-b border-white/10">
        <div>
            <h2 className="text-2xl font-black text-white uppercase italic">Bio-Metrics</h2>
            <p className="text-xs text-white/40">SYSTEM CONFIGURATION</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-cyan-400 transition-colors"
        >
          SAVE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 no-scrollbar">
        
        {/* Identity Section */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-2">Subject Identity</h3>
           <div className="space-y-1">
             <label className="text-xs text-white/50 ml-1">Display Name</label>
             <input 
               type="text" 
               value={formData.name}
               onChange={(e) => handleChange('name', e.target.value)}
               className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none transition-all placeholder-white/20"
               placeholder="Enter Name"
             />
           </div>
        </section>

        {/* Physiology Section */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-2">Physiology</h3>
           
           <div className="flex gap-4">
             <div className="flex-1 space-y-1">
               <label className="text-xs text-white/50 ml-1">Weight (kg)</label>
               <input 
                 type="number" 
                 value={formData.weightKg}
                 onChange={(e) => handleChange('weightKg', parseFloat(e.target.value))}
                 className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-mono focus:border-cyan-500 focus:outline-none"
               />
             </div>
             <div className="flex-1 space-y-1">
                <label className="text-xs text-white/50 ml-1">Container (mL)</label>
                <input 
                    type="number" 
                    value={formData.containerSizeML}
                    onChange={(e) => handleChange('containerSizeML', parseInt(e.target.value))}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
             </div>
           </div>

           <div className="space-y-2 pt-2">
              <label className="text-xs text-white/50 ml-1">Daily Activity Level</label>
              <div className="flex gap-2">
                  <ActivityOption level="low" label="Low" />
                  <ActivityOption level="medium" label="Mid" />
                  <ActivityOption level="high" label="High" />
              </div>
           </div>
        </section>

        {/* Targets Section */}
        <section className="space-y-6">
           <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-2">Targets</h3>
           
           <div className="bg-[#111] rounded-2xl p-5 border border-white/5 space-y-4">
             <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-white">Daily Goal</label>
                <span className="text-xl font-mono text-cyan-400 font-bold">{formData.dailyGoalML} <span className="text-xs text-white/50">mL</span></span>
             </div>
             
             {/* Custom Range Slider Styling */}
             <div className="relative w-full h-6 flex items-center">
                 <div className="absolute w-full h-1 bg-white/10 rounded-full" />
                 <div 
                    className="absolute h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full" 
                    style={{ width: `${((formData.dailyGoalML - 1000) / 3000) * 100}%` }}
                 />
                 <input 
                   type="range" 
                   min="1000" max="4000" step="50"
                   value={formData.dailyGoalML}
                   onChange={(e) => handleChange('dailyGoalML', parseInt(e.target.value))}
                   className="absolute w-full h-full opacity-0 cursor-pointer"
                 />
                 {/* Thumb simulation handled by browser defaults usually, but custom CSS could go deep here. 
                     For now relying on opacity-0 input over visual bar */}
                 <div 
                    className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_10px_black] pointer-events-none transition-transform"
                    style={{ left: `calc(${((formData.dailyGoalML - 1000) / 3000) * 100}% - 12px)` }}
                 />
             </div>
           </div>
        </section>

        {/* Notification Section */}
        <section className="space-y-4 pb-12">
           <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-2">Alert Protocols</h3>
           
           <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                <div 
                    className="flex items-center justify-between p-4 cursor-pointer active:bg-white/5"
                    onClick={() => handleChange('notificationsEnabled', !formData.notificationsEnabled)}
                >
                    <div>
                        <div className="text-sm font-bold text-white">Hydration Reminders</div>
                        <div className="text-[10px] text-white/40">Push notifications for intake status</div>
                    </div>
                    {/* Switch Toggle */}
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${formData.notificationsEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>

                {formData.notificationsEnabled && (
                    <div className="p-4 bg-black/20 border-t border-white/5 grid grid-cols-2 gap-4 animate-in fade-in">
                        <div className="space-y-1">
                           <label className="text-[10px] uppercase text-white/30 tracking-wider">Start Time</label>
                           <input 
                             type="time" 
                             value={formData.reminderStartTime} 
                             onChange={(e) => handleChange('reminderStartTime', e.target.value)} 
                             className="w-full bg-transparent border-b border-white/20 text-white font-mono text-lg focus:outline-none focus:border-cyan-500 py-1" 
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] uppercase text-white/30 tracking-wider">End Time</label>
                           <input 
                             type="time" 
                             value={formData.reminderEndTime} 
                             onChange={(e) => handleChange('reminderEndTime', e.target.value)} 
                             className="w-full bg-transparent border-b border-white/20 text-white font-mono text-lg focus:outline-none focus:border-cyan-500 py-1" 
                           />
                        </div>
                    </div>
                )}
           </div>
        </section>
      </div>
    </div>
  );
};