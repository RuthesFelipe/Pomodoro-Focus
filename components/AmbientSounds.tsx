
import React, { useState, useRef } from 'react';
import { Volume2, CloudRain, Waves, Wind, Trees, Coffee, Zap, Lock, Crown } from 'lucide-react';
import { translations, Language } from '../translations';
import { SubscriptionTier } from '../types';

interface AmbientSoundsProps {
  lang: Language;
  tier: SubscriptionTier;
  onLockedClick: () => void;
}

export const AmbientSounds: React.FC<AmbientSoundsProps> = ({ lang, tier, onLockedClick }) => {
  const t = translations[lang];
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sounds = [
    { id: 'rain', icon: CloudRain, label: t.rain, color: 'bg-blue-500', url: 'https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3', isPremium: false },
    { id: 'waves', icon: Waves, label: t.waves, color: 'bg-cyan-500', url: 'https://assets.mixkit.co/active_storage/sfx/1208/1208-preview.mp3', isPremium: false },
    { id: 'cafe', icon: Coffee, label: t.cafe, color: 'bg-orange-600', url: 'https://assets.mixkit.co/active_storage/sfx/1271/1271-preview.mp3', isPremium: true },
    { id: 'brown', icon: Zap, label: t.brownNoise, color: 'bg-amber-600', url: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3', isPremium: true },
  ];

  const toggleSound = (sound: typeof sounds[0]) => {
    if (sound.isPremium && tier === 'free') {
      onLockedClick();
      return;
    }

    if (activeSound === sound.id) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = sound.url;
        audioRef.current.loop = true;
        audioRef.current.play().catch((err) => console.error("Playback failed:", err));
      }
      setActiveSound(sound.id);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-7 bg-white rounded-[40px] shadow-xl border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-black font-outfit uppercase tracking-tighter">
          <div className="p-2 bg-slate-100 rounded-xl">
            <Volume2 size={18} className="text-slate-600" />
          </div>
          <h3>{t.focusAtmosphere}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {sounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => toggleSound(sound)}
            className={`relative flex items-center gap-3 p-4 rounded-3xl transition-all group overflow-hidden ${
              activeSound === sound.id 
                ? `${sound.color} text-white shadow-xl scale-105` 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            } ${sound.isPremium && tier === 'free' ? 'opacity-70' : ''}`}
          >
            <sound.icon size={20} className={activeSound === sound.id ? 'animate-pulse' : ''} />
            <span className="text-[11px] font-black uppercase tracking-widest">{sound.label}</span>
            
            {sound.isPremium && tier === 'free' && (
              <div className="absolute top-1 right-2">
                <Crown size={10} className="text-amber-500" fill="currentColor" />
              </div>
            )}
          </button>
        ))}
      </div>
      <audio ref={audioRef} preload="auto" />
      
      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-[0.2em] mt-2 italic">
        Combine sounds for better isolation
      </p>
    </div>
  );
};
