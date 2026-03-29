'use client';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './styles/AudioAgent.module.css';

export default function AudioAgentProvider({ children }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    // 1. Prepare Speech Synthesis Engine (Native to Browser & Capacitor WebView)
    // Note: Due to browser autoplay policies, synthesis must be initialized after first user interaction.
    // In Capacitor, native audio bypasses this but it's safe to check.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
       setEngineReady(true);
    }

    // 2. Connect to the Elysia Agentic IoT WebSockets
    const ws = new WebSocket('ws://localhost:4000/api/iot/stream');
    
    ws.onopen = () => {
      console.log('🔗 [Audio Agent] Connected to Care Stream');
      ws.send(JSON.stringify({ type: 'subscribe', role: 'caretaker' }));
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === 'trigger_audio_alert') {
         console.log('🚨 Received Critical Agentic Alert:', payload.taskName);
         setActiveAlert(payload);
         playTamilAudio(payload.tamilMessage);
      }
    };

    return () => ws.close();
  }, []);

  const playTamilAudio = (text) => {
    if (!window.speechSynthesis) return;

    // Use Tamil if the voice exists on the Native device natively, else fallback natively
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN'; 
    utterance.volume = 1;
    utterance.rate = 0.9; // Slightly slower for clarity
    
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.includes('ta'));
    if (tamilVoice) utterance.voice = tamilVoice;

    window.speechSynthesis.speak(utterance);

    // Auto-clear alert from UI after 10 seconds
    setTimeout(() => setActiveAlert(null), 10000);
  };

  const dismissAlert = () => {
    setActiveAlert(null);
    window.speechSynthesis.cancel();
  };

  return (
    <>
      {children}

      {/* Visually unobtrusive but present overlay for when the AI speaks */}
      {activeAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertCard}>
            <div className={styles.alertIconPulse}>
              <Volume2 size={32} />
            </div>
            <div className={styles.alertContent}>
               <h3>AI Caretaker Alert</h3>
               <p>Missed Task: <strong>{activeAlert.taskName}</strong></p>
               <span className={styles.tamilText}>{activeAlert.tamilMessage}</span>
            </div>
            <button className={styles.dismissBtn} onClick={dismissAlert}>
               Acknowledge
            </button>
          </div>
        </div>
      )}
    </>
  );
}
