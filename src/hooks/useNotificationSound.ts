import { useCallback, useRef } from 'react';

// Simple beep using Web Audio API
export function useNotificationSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    try {
      // Create audio context lazily
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Configure the beep sound - cyber/tech style
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      oscillator.type = 'sine';
      
      // Fade in and out for a pleasant sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
      
      // Second beep for confirmation
      setTimeout(() => {
        if (!audioContextRef.current) return;
        const ctx2 = audioContextRef.current;
        const osc2 = ctx2.createOscillator();
        const gain2 = ctx2.createGain();
        
        osc2.connect(gain2);
        gain2.connect(ctx2.destination);
        
        osc2.frequency.setValueAtTime(1100, ctx2.currentTime); // Higher note
        osc2.type = 'sine';
        
        gain2.gain.setValueAtTime(0, ctx2.currentTime);
        gain2.gain.linearRampToValueAtTime(0.1, ctx2.currentTime + 0.05);
        gain2.gain.linearRampToValueAtTime(0, ctx2.currentTime + 0.15);
        
        osc2.start(ctx2.currentTime);
        osc2.stop(ctx2.currentTime + 0.15);
      }, 150);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

  return { playBeep };
}
