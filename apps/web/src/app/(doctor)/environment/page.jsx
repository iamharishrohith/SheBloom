'use client';
import { useState, useEffect } from 'react';
import { ThermometerSun, Droplets, Wind, Wifi, WifiOff, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import styles from './environment.module.css';

export default function EnvironmentPage() {
  const [envData, setEnvData] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/api/iot/stream');
    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', role: 'doctor' }));
    };
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === 'environment_update') {
        setEnvData(payload.data);
        setLastUpdate(new Date());
        setHistory(prev => [...prev, { ...payload.data, time: new Date().toLocaleTimeString() }].slice(-60));
      }
      if (payload.event === 'environment_alert') {
        setAlerts(prev => [{ ...payload, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
      }
    };
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    return () => ws.close();
  }, []);

  const getAqColor = (level) => {
    const map = { 'Excellent': '#2ecc71', 'Good': '#f1c40f', 'Moderate': '#e67e22', 'Poor': '#e74c3c', 'Hazardous': '#9b59b6' };
    return map[level] || '#95a5a6';
  };

  const getAqWidth = (ppm) => Math.min((ppm / 600) * 100, 100);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1><Wind size={28} /> Live Environment Monitor</h1>
          <p>Real-time maternal room conditions from ESP32 IoT sensors</p>
        </div>
        <div className={`${styles.statusBadge} ${connected ? styles.online : styles.offline}`}>
          {connected ? <><Wifi size={16} /> Connected</> : <><WifiOff size={16} /> Disconnected</>}
        </div>
      </header>

      {/* Large Gauges */}
      <section className={styles.gaugeGrid}>
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeIcon} style={{ color: '#e74c3c' }}><ThermometerSun size={32} /></div>
          <div className={styles.gaugeValue}>{envData?.temperature ?? '—'}°C</div>
          <div className={styles.gaugeLabel}>Temperature</div>
          <div className={styles.gaugeBar}>
            <div className={styles.gaugeBarFill} style={{ width: `${Math.min(((envData?.temperature || 0) / 50) * 100, 100)}%`, background: 'linear-gradient(90deg, #3498db, #e74c3c)' }} />
          </div>
          <div className={styles.gaugeMeta}>Ideal: 22-28°C</div>
        </div>

        <div className={styles.gaugeCard}>
          <div className={styles.gaugeIcon} style={{ color: '#3498db' }}><Droplets size={32} /></div>
          <div className={styles.gaugeValue}>{envData?.humidity ?? '—'}%</div>
          <div className={styles.gaugeLabel}>Humidity</div>
          <div className={styles.gaugeBar}>
            <div className={styles.gaugeBarFill} style={{ width: `${envData?.humidity || 0}%`, background: 'linear-gradient(90deg, #f39c12, #3498db)' }} />
          </div>
          <div className={styles.gaugeMeta}>Ideal: 40-60%</div>
        </div>

        <div className={styles.gaugeCard}>
          <div className={styles.gaugeIcon} style={{ color: getAqColor(envData?.airQuality?.level) }}><Wind size={32} /></div>
          <div className={styles.gaugeValue}>{envData?.airQuality?.ppm ?? '—'} <small>PPM</small></div>
          <div className={styles.gaugeLabel}>Air Quality</div>
          <div className={styles.gaugeBar}>
            <div className={styles.gaugeBarFill} style={{ width: `${getAqWidth(envData?.airQuality?.ppm || 0)}%`, background: getAqColor(envData?.airQuality?.level) }} />
          </div>
          <div className={styles.aqBadge} style={{ background: getAqColor(envData?.airQuality?.level) + '20', color: getAqColor(envData?.airQuality?.level) }}>
            {envData?.airQuality?.level || 'Waiting...'}
          </div>
        </div>
      </section>

      {/* Last Update */}
      {lastUpdate && (
        <div className={styles.updateBar}>
          <RefreshCw size={14} />
          Last update: {lastUpdate.toLocaleTimeString()} • Interval: 5s
        </div>
      )}

      {/* History & Alerts */}
      <div className={styles.panelGrid}>
        {/* Reading History */}
        <div className={styles.panel}>
          <h3><Clock size={18} /> Recent Readings</h3>
          <div className={styles.historyTable}>
            <div className={styles.tableHeader}>
              <span>Time</span><span>Temp</span><span>Humidity</span><span>AQ (PPM)</span>
            </div>
            {history.length === 0 && <div className={styles.emptyRow}>Waiting for sensor data...</div>}
            {history.slice(-15).reverse().map((h, i) => (
              <div key={i} className={styles.tableRow}>
                <span>{h.time}</span>
                <span>{h.temperature}°C</span>
                <span>{h.humidity}%</span>
                <span style={{ color: getAqColor(h.airQuality?.level) }}>{h.airQuality?.ppm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Log */}
        <div className={styles.panel}>
          <h3><AlertTriangle size={18} /> Alert Log</h3>
          {alerts.length === 0 && <div className={styles.emptyRow}>No alerts triggered yet. Alerts fire when air quality exceeds 300 PPM.</div>}
          {alerts.map((a, i) => (
            <div key={i} className={styles.alertCard}>
              <div className={styles.alertTime}>{a.time}</div>
              <div className={styles.alertMsg}>{a.message}</div>
              <div className={styles.alertSeverity} data-severity={a.severity}>{a.severity?.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
