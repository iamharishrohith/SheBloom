'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Baby, Heart, CalendarClock, Pill, Droplets, Footprints,
  HeartPulse, ShieldCheck, BookOpen, UtensilsCrossed,
  FileText, Sparkles, TrendingUp, ArrowRight, Clock,
  Activity, ThermometerSun, CloudSun, CloudRain, MapPin,
  Wind, AlertTriangle, Wifi, WifiOff, Volume2
} from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import ExplainDialog from '@/components/ExplainDialog';
import styles from './dashboard.module.css';

const DEMO_DATA = {
  caretakerName: 'Rohith',
  herName: 'Priya',
  trimester: 2,
  weekNumber: 20,
  daysUntilDue: 140,
  conditions: ['anemia-mild'],
  schedule: 'working-9-6',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTrimesterLabel(t) {
  return ['', 'First Trimester', 'Second Trimester', 'Third Trimester', 'Postpartum'][t] || '';
}

function getAqColor(level) {
  return { Excellent: '#2ecc71', Good: '#f1c40f', Moderate: '#e67e22', Poor: '#e74c3c', Hazardous: '#9b59b6' }[level] || '#95a5a6';
}

export default function DashboardPage() {
  const router = useRouter();
  const [data] = useState(DEMO_DATA);
  const [weather, setWeather] = useState({ temp: null, desc: null, loading: true });
  const [iotData, setIotData] = useState(null);
  const [iotConnected, setIotConnected] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeExplainTask, setActiveExplainTask] = useState(null);
  const wsRef = useRef(null);

  // WebSocket for live IoT data
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/api/iot/stream');
    wsRef.current = ws;

    ws.onopen = () => {
      setIotConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', role: 'caretaker' }));
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === 'live_environment') {
        setIotData(payload.data);
      }
      if (payload.event === 'environment_alert') {
        setAlert(payload);
        // Speak the alert using Web Speech API (zero-cost alerting)
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(payload.message);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
        setTimeout(() => setAlert(null), 10000);
      }
    };

    ws.onclose = () => setIotConnected(false);
    ws.onerror = () => setIotConnected(false);
    return () => ws.close();
  }, []);

  // Weather (graceful fallback)
  useEffect(() => {
    async function fetchWeather() {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
            const wdata = await res.json();
            const code = wdata.current.weather_code;
            let desc = 'Clear';
            if (code > 0) desc = 'Cloudy';
            if (code > 50) desc = 'Rain';
            setWeather({ temp: wdata.current.temperature_2m, desc, loading: false });
          }, () => setWeather({ temp: null, desc: 'N/A', loading: false }));
        } else {
          setWeather({ temp: null, desc: 'N/A', loading: false });
        }
      } catch {
        setWeather({ temp: null, desc: 'N/A', loading: false });
      }
    }
    fetchWeather();
  }, []);

  const quickCards = [
    { title: 'Your Care Schedule', desc: `Doctor-verified daily timeline for ${data.herName}`, icon: <CalendarClock size={28} />, href: '/timeline', verified: 'doctor', color: 'var(--color-primary)' },
    { title: 'Nutrition Plan', desc: 'Trimester-specific meal planning', icon: <UtensilsCrossed size={28} />, href: '/meals', verified: 'doctor', color: '#6a994e' },
    { title: 'Leave Generator', desc: 'Auto-generate care leave applications', icon: <FileText size={28} />, href: '/leave', color: 'var(--color-primary-muted)' },
    { title: 'Emergency Guide', desc: 'Red flags & SOS contacts', icon: <AlertTriangle size={28} />, href: '/emergency', color: 'var(--color-danger)' },
    { title: 'Learning Center', desc: 'Simplified medical knowledge', icon: <BookOpen size={28} />, href: '/learn', color: '#2a9d8f' },
    { title: 'Recovery Tracker', desc: 'Postpartum care & PPD screening', icon: <HeartPulse size={28} />, href: '/recovery', verified: 'doctor', color: '#b5838d' },
  ];

  const todaySuggestions = [
    { title: 'Ensure iron tablet is taken with vitamin C juice', gap: 'Nutrition Gap', gapColor: 'nutrition', verified: 'doctor', citation: 'WHO ANC Guidelines — Iron + Vit C absorption synergy', icon: <Pill size={18} /> },
    { title: `Remind ${data.herName} to drink 3L water today`, gap: 'Action Gap', gapColor: 'action', verified: 'doctor', citation: 'WHO recommends 2.3–3L daily during pregnancy', icon: <Droplets size={18} /> },
    { title: 'Evening walk together — 20 min, gentle pace', gap: 'Action Gap', gapColor: 'action', verified: 'doctor', citation: 'ACOG: 150 min/week moderate exercise recommended', icon: <Footprints size={18} /> },
    { title: `Ask ${data.herName} how she's feeling emotionally`, gap: 'Emotional Gap', gapColor: 'emotional', verified: 'evidence', citation: 'Lancet: Emotional support reduces PPD risk by 40%', icon: <Heart size={18} /> },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Air Quality Alert Banner */}
      {alert && (
        <div className={styles.alertBanner}>
          <Volume2 size={18} />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Hero greeting */}
      <section className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <p className={styles.heroLabel}>{getTrimesterLabel(data.trimester)}</p>
          <h1 className={styles.heroTitle}>{getGreeting()}, {data.caretakerName}</h1>
          <p className={styles.heroSub}>
            {data.herName} is in week {data.weekNumber} — {data.daysUntilDue} days until your world changes forever
          </p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.weekBadge}>
            <Baby size={24} />
            <span className={styles.weekNum}>W{data.weekNumber}</span>
          </div>
        </div>
      </section>

      {/* Live IOT Status Bar */}
      <section className={styles.iotBar}>
        <div className={styles.iotItem}>
          <ThermometerSun size={16} />
          <span>Room: {iotData?.temperature ?? '—'}°C</span>
        </div>
        <div className={styles.iotItem}>
          <Droplets size={16} />
          <span>Humidity: {iotData?.humidity ?? '—'}%</span>
        </div>
        <div className={styles.iotItem}>
          <Wind size={16} />
          <span style={{ color: iotData ? getAqColor(iotData.airQualityLevel) : undefined }}>
            Air: {iotData?.airQualityPPM ?? '—'} PPM ({iotData?.airQualityLevel ?? '—'})
          </span>
        </div>
        <div className={styles.iotItem} style={{ borderLeft: '1px solid var(--color-primary-muted)', paddingLeft: 'var(--space-md)' }}>
          {weather.loading ? (
            <><Activity size={16} /><span>Locating...</span></>
          ) : weather.temp !== null ? (
            <>{weather.desc === 'Rain' ? <CloudRain size={16} /> : weather.desc === 'Cloudy' ? <CloudSun size={16} /> : <ThermometerSun size={16} />}<span>Outdoors: {weather.temp}°C</span></>
          ) : (
            <><MapPin size={16} /><span>{weather.desc || 'Location Off'}</span></>
          )}
        </div>
        <span className={styles.iotLabel}>
          <span className={styles.liveDot} style={{ background: iotConnected ? '#2ecc71' : '#e74c3c' }}></span>
          {iotConnected ? 'ESP32 Live' : 'ESP32 Offline'}
        </span>
      </section>

      {/* Today's Care Suggestions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><Clock size={20} /> Today's Care Focus</h2>
        <div className={styles.suggestionsGrid}>
          {todaySuggestions.map((s, i) => (
            <div key={i} className={styles.suggestionCard}>
              <div className={styles.suggestionIcon} data-gap={s.gapColor}>{s.icon}</div>
              <div className={styles.suggestionContent}>
                <p className={styles.suggestionTitle}>{s.title}</p>
                <div className={styles.suggestionMeta}>
                  <VerifyBadge level={s.verified} citation={s.citation} />
                  <span className={`${styles.gapTag} ${styles[s.gapColor]}`}>{s.gap}</span>
                </div>
                <p className={styles.citation}>{s.citation}</p>
                <button 
                  className={styles.explainBtn} 
                  onClick={() => setActiveExplainTask({ name: s.title, context: s.gapColor })}
                >
                  <Sparkles size={14} /> Explain 
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><TrendingUp size={20} /> Quick Actions</h2>
        <div className={styles.quickGrid}>
          {quickCards.map((card, i) => (
            <button key={i} className={styles.quickCard} onClick={() => router.push(card.href)}>
              <div className={styles.quickIcon} style={{ color: card.color }}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              {card.verified && <VerifyBadge level={card.verified} />}
              <ArrowRight size={16} className={styles.quickArrow} />
            </button>
          ))}
        </div>
      </section>

      <ExplainDialog 
        isOpen={!!activeExplainTask} 
        onClose={() => setActiveExplainTask(null)} 
        task={activeExplainTask}
        context={activeExplainTask?.context}
      />
    </div>
  );
}
