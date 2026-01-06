
import React, { useState, useEffect } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { AmbientSounds } from './components/AmbientSounds';
// Fix: Added missing Volume2 import from lucide-react
import { Settings as SettingsIcon, LayoutGrid, Info, Crown, BarChart3, Moon, Sun, Trees, Zap, Volume2 } from 'lucide-react';
import { Settings, TimerMode, SubscriptionTier, AppTheme } from './types';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt');
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const t = translations[lang];

  const [settings, setSettings] = useState<Settings>({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    isADHDMode: false,
    theme: 'classic'
  });
  
  const [stats, setStats] = useState({ sessions: 0, totalFocusMinutes: 0 });
  const [showSettings, setShowSettings] = useState(false);

  const themeClasses = {
    classic: 'bg-slate-50 selection:bg-rose-100 selection:text-rose-900',
    dark: 'bg-slate-950 text-slate-100 selection:bg-slate-800 selection:text-white',
    nature: 'bg-emerald-50 selection:bg-emerald-100 selection:text-emerald-900',
    sunset: 'bg-orange-50 selection:bg-orange-100 selection:text-orange-900',
    minimal: 'bg-white selection:bg-slate-100 selection:text-slate-900'
  };

  const handleSessionComplete = (mode: TimerMode) => {
    if (mode === 'work') {
      const addedMinutes = settings.isADHDMode ? 15 : settings.workTime;
      setStats(prev => ({
        sessions: prev.sessions + 1,
        totalFocusMinutes: prev.totalFocusMinutes + addedMinutes
      }));
    }
  };

  const togglePremium = () => {
    setTier(tier === 'free' ? 'premium' : 'free');
    setShowUpgradeModal(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans ${themeClasses[settings.theme]}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b ${settings.theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white/70 border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center">
            <LayoutGrid className="text-white" size={18} />
          </div>
          <span className={`text-xl font-outfit font-black tracking-tighter uppercase ${settings.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            POMODOROFOCUS
          </span>
          {tier === 'premium' && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
              <Crown size={10} fill="currentColor" /> PREMIUM
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex bg-slate-100/50 p-1 rounded-xl">
            {(['en', 'pt', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  lang === l ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {tier === 'free' ? (
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <Crown size={14} fill="currentColor" /> {t.goPremium}
            </button>
          ) : (
            <div className="p-2 text-amber-500"><Crown size={22} fill="currentColor" /></div>
          )}

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-all ${settings.theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-rose-50 hover:text-rose-500'}`}
          >
            <SettingsIcon size={22} />
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        <div className="flex flex-col gap-8 w-full lg:w-auto items-center">
          <PomodoroTimer 
            settings={settings} 
            onSessionComplete={handleSessionComplete}
            lang={lang}
            tier={tier}
          />
          
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-3xl shadow-sm border transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.sessions}</p>
              <p className={`text-2xl font-outfit font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.sessions}</p>
            </div>
            <div className={`p-5 rounded-3xl shadow-sm border transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.totalFocus}</p>
              <p className={`text-2xl font-outfit font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.totalFocusMinutes}{t.minutesAbbr}</p>
            </div>
          </div>

          {/* Premium Stats Visualization */}
          {tier === 'premium' && (
            <div className={`w-full max-w-md p-6 rounded-3xl border ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2"><BarChart3 size={16} /> {t.weeklyProgress}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">7 Days</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[30, 45, 20, 60, 80, 40, 50].map((h, i) => (
                  <div key={i} className="flex-grow bg-rose-500/20 rounded-t-md relative group cursor-pointer">
                    <div style={{ height: `${h}%` }} className="bg-rose-500 rounded-t-md w-full transition-all group-hover:bg-rose-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 w-full max-w-md mx-auto lg:mx-0">
          <TaskList lang={lang} />
          <AmbientSounds lang={lang} tier={tier} onLockedClick={() => setShowUpgradeModal(true)} />
          
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 relative overflow-hidden group">
            <Info className="absolute -right-2 -bottom-2 w-24 h-24 text-rose-100 transition-transform group-hover:scale-110" />
            <h4 className="text-sm font-bold text-rose-600 mb-2 flex items-center gap-2">{t.focusTip}</h4>
            <p className="text-sm text-rose-900 leading-relaxed relative z-10">{t.tipContent}</p>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-slate-900">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-outfit">{t.settingsTitle}</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{t.workMinutes}</label>
                <input 
                  type="range" min="1" max="60" value={settings.workTime} 
                  onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value)})}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                  <span>1{t.minutesAbbr}</span>
                  <span className="text-rose-600 font-bold">{settings.workTime}{t.minutesAbbr}</span>
                  <span>60{t.minutesAbbr}</span>
                </div>
              </div>

              {/* Theme Selector (Premium) */}
              <div className={tier === 'free' ? 'opacity-50 pointer-events-none' : ''}>
                <div className="flex items-center justify-between mb-3">
                   <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.theme}</label>
                   {tier === 'free' && <Crown size={12} className="text-amber-500" />}
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'classic', icon: Sun, color: 'bg-slate-100' },
                    { id: 'dark', icon: Moon, color: 'bg-slate-900' },
                    { id: 'nature', icon: Trees, color: 'bg-emerald-100' },
                    { id: 'sunset', icon: Zap, color: 'bg-orange-100' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({...settings, theme: theme.id as AppTheme})}
                      className={`flex-grow aspect-square rounded-xl flex items-center justify-center border-2 transition-all ${
                        settings.theme === theme.id ? 'border-rose-500 shadow-md' : 'border-transparent ' + theme.color
                      }`}
                    >
                      <theme.icon size={18} className={theme.id === 'dark' ? 'text-white' : 'text-slate-600'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ADHD Mode (Premium) */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${tier === 'free' ? 'border-slate-100 opacity-50' : settings.isADHDMode ? 'border-amber-500 bg-amber-50' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Zap size={16} fill={settings.isADHDMode ? 'currentColor' : 'none'} className={settings.isADHDMode ? 'text-amber-500' : 'text-slate-400'} />
                    {t.adhdMode}
                  </h4>
                  <button 
                    disabled={tier === 'free'}
                    onClick={() => setSettings({...settings, isADHDMode: !settings.isADHDMode})}
                    className={`w-10 h-6 rounded-full transition-colors relative ${settings.isADHDMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.isADHDMode ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{t.adhdDesc}</p>
                {tier === 'free' && (
                   <button onClick={() => {setShowSettings(false); setShowUpgradeModal(true);}} className="mt-3 text-[10px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                     <Crown size={10} /> Unlock with Premium
                   </button>
                )}
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-colors"
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-300">
            <div className="relative h-48 bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <Crown className="text-white w-24 h-24 drop-shadow-lg" fill="currentColor" />
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-10 text-center">
              <h2 className="text-3xl font-outfit font-black mb-4 uppercase tracking-tighter">Unlock POMODOROFOCUS+</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: BarChart3, label: 'Advanced Stats' },
                  { icon: Zap, label: 'ADHD Mode' },
                  { icon: Moon, label: 'Premium Themes' },
                  { icon: Volume2, label: 'Exclusive Sounds' }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <f.icon className="text-amber-500 mb-2" size={18} />
                    <span className="text-[10px] font-bold uppercase text-slate-500">{f.label}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={togglePremium}
                className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-3xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl"
              >
                UPGRADE NOW
              </button>
              <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">Only $4.99/month • Cancel anytime</p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 py-12 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default App;
