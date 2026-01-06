
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, FastForward, Zap } from 'lucide-react';
import { TimerMode, Settings, SubscriptionTier } from '../types';
import { translations, Language } from '../translations';

interface PomodoroTimerProps {
  settings: Settings;
  onSessionComplete: (mode: TimerMode) => void;
  lang: Language;
  tier: SubscriptionTier;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ settings, onSessionComplete, lang, tier }) => {
  const t = translations[lang];
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [adhdCycle, setAdhdCycle] = useState(0); // For ADHD adaptive cycles
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getTargetTime = useCallback((m: TimerMode) => {
    if (settings.isADHDMode && tier === 'premium' && m === 'work') {
      // ADHD mode cycles: alternating between 15 and 25 mins
      return adhdCycle % 2 === 0 ? 15 * 60 : 25 * 60;
    }
    const times = {
      work: settings.workTime * 60,
      shortBreak: settings.shortBreak * 60,
      longBreak: settings.longBreak * 60,
    };
    return times[m];
  }, [settings, adhdCycle, tier]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(getTargetTime(newMode));
  }, [getTargetTime]);

  useEffect(() => {
    setTimeLeft(getTargetTime(mode));
  }, [settings.workTime, settings.shortBreak, settings.longBreak, settings.isADHDMode, mode, getTargetTime]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete(mode);
      
      const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      sound.play().catch(() => {});
      
      if (mode === 'work') {
        if (settings.isADHDMode) setAdhdCycle(prev => prev + 1);
        switchMode('shortBreak');
      } else {
        switchMode('work');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete, switchMode, settings.isADHDMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getTargetTime(mode));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = getTargetTime(mode);
  const progress = 1 - timeLeft / totalTime;

  const modeColors = {
    work: 'text-rose-500',
    shortBreak: 'text-emerald-500',
    longBreak: 'text-sky-500',
  };

  const bgColors = {
    work: 'bg-rose-500',
    shortBreak: 'bg-emerald-500',
    longBreak: 'bg-sky-500',
  };

  return (
    <div className={`flex flex-col items-center p-8 rounded-[40px] shadow-2xl border transition-all duration-700 w-full max-w-md ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className={`flex gap-2 mb-10 p-1.5 rounded-2xl transition-colors ${settings.theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {(['work', 'shortBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
              mode === m 
                ? `${settings.theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white shadow-sm text-slate-800'}` 
                : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            {m === 'work' ? (settings.isADHDMode ? <Zap className="inline mr-1" size={14} fill="currentColor" /> : <Brain className="inline mr-1" size={14} />) : <Coffee className="inline mr-1" size={14} />}
            {translations[lang][m]}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-72 h-72 mb-12">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle cx="144" cy="144" r="134" stroke="currentColor" strokeWidth="6" fill="transparent" className={settings.theme === 'dark' ? 'text-slate-800' : 'text-slate-100'} />
          <circle
            cx="144" cy="144" r="134" stroke="currentColor" strokeWidth="10" fill="transparent"
            strokeDasharray={2 * Math.PI * 134}
            strokeDashoffset={2 * Math.PI * 134 * (1 - progress)}
            strokeLinecap="round"
            className={`${modeColors[mode]} transition-all duration-500`}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className={`text-7xl font-outfit font-black tracking-tighter ${settings.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {formatTime(timeLeft)}
          </span>
          <div className="flex items-center gap-2 mt-4">
             {settings.isADHDMode && <Zap size={12} className="text-amber-500" fill="currentColor" />}
             <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
               {translations[lang][mode]}
             </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <button onClick={resetTimer} className={`p-4 rounded-2xl transition-all ${settings.theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
          <RotateCcw size={22} />
        </button>
        
        <button
          onClick={toggleTimer}
          className={`p-8 rounded-[32px] shadow-2xl transition-all hover:scale-110 active:scale-95 text-white ${
            isActive ? (settings.theme === 'dark' ? 'bg-slate-700' : 'bg-slate-800') : bgColors[mode]
          }`}
        >
          {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={() => setTimeLeft(0)} className={`p-4 rounded-2xl transition-all ${settings.theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
          <FastForward size={22} />
        </button>
      </div>
    </div>
  );
};
