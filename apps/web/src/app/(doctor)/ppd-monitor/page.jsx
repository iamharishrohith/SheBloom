'use client';
import { useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, TrendingDown, User, Shield, Clock, ChevronRight } from 'lucide-react';
import styles from './ppd.module.css';

const PATIENTS_PPD = [
  { id: 1, name: 'Priya Sharma', scores: [4, 5, 6, 5, 7, 6], current: 6, trend: 'stable', risk: 'low', lastScreened: '2026-03-28' },
  { id: 2, name: 'Anita Reddy', scores: [3, 5, 8, 10, 11, 13], current: 13, trend: 'rising', risk: 'high', lastScreened: '2026-03-27' },
  { id: 3, name: 'Meera Krishnan', scores: [2, 2, 3, 2, 3, 2], current: 2, trend: 'stable', risk: 'low', lastScreened: '2026-03-28' },
  { id: 4, name: 'Lakshmi Patel', scores: [8, 9, 10, 9, 11, 10], current: 10, trend: 'rising', risk: 'moderate', lastScreened: '2026-03-26' },
  { id: 5, name: 'Divya Nair', scores: [5, 4, 3, 4, 3, 3], current: 3, trend: 'improving', risk: 'low', lastScreened: '2026-03-28' },
];

function getRiskColor(risk) {
  return { low: '#2ecc71', moderate: '#f39c12', high: '#e74c3c', critical: '#9b59b6' }[risk] || '#95a5a6';
}

function getRiskBg(risk) {
  return { low: 'rgba(46,204,113,0.1)', moderate: 'rgba(243,156,18,0.1)', high: 'rgba(231,76,60,0.1)', critical: 'rgba(155,89,182,0.1)' }[risk];
}

export default function PPDMonitorPage() {
  const [selected, setSelected] = useState(null);

  const riskCounts = {
    low: PATIENTS_PPD.filter(p => p.risk === 'low').length,
    moderate: PATIENTS_PPD.filter(p => p.risk === 'moderate').length,
    high: PATIENTS_PPD.filter(p => p.risk === 'high').length,
  };

  const flagged = PATIENTS_PPD.filter(p => p.risk !== 'low');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1><Brain size={28} /> PPD Risk Monitor</h1>
        <p>Edinburgh Postnatal Depression Scale tracking across all patients</p>
      </header>

      {/* Risk Overview */}
      <div className={styles.riskGrid}>
        <div className={styles.riskCard} style={{ borderTop: `4px solid #2ecc71` }}>
          <Shield size={24} color="#2ecc71" />
          <span className={styles.riskCount}>{riskCounts.low}</span>
          <span className={styles.riskLabel}>Low Risk</span>
          <span className={styles.riskRange}>Score: 0-8</span>
        </div>
        <div className={styles.riskCard} style={{ borderTop: `4px solid #f39c12` }}>
          <AlertTriangle size={24} color="#f39c12" />
          <span className={styles.riskCount}>{riskCounts.moderate}</span>
          <span className={styles.riskLabel}>Moderate</span>
          <span className={styles.riskRange}>Score: 9-12</span>
        </div>
        <div className={styles.riskCard} style={{ borderTop: `4px solid #e74c3c` }}>
          <AlertTriangle size={24} color="#e74c3c" />
          <span className={styles.riskCount}>{riskCounts.high}</span>
          <span className={styles.riskLabel}>High Risk</span>
          <span className={styles.riskRange}>Score: 13+</span>
        </div>
      </div>

      {/* Flagged Patients Alert */}
      {flagged.length > 0 && (
        <div className={styles.alertBox}>
          <AlertTriangle size={18} />
          <span><strong>{flagged.length} patient{flagged.length > 1 ? 's' : ''}</strong> require clinical attention for elevated PPD scores.</span>
        </div>
      )}

      {/* Patient PPD Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Patient</span>
          <span>Current Score</span>
          <span>Risk Level</span>
          <span>Trend</span>
          <span>Last Screened</span>
          <span>Score History</span>
        </div>
        {PATIENTS_PPD.map(p => (
          <div key={p.id} className={`${styles.tableRow} ${p.risk !== 'low' ? styles.flaggedRow : ''}`} onClick={() => setSelected(selected === p.id ? null : p.id)}>
            <span className={styles.nameCell}>
              <div className={styles.avatar}>{p.name.charAt(0)}</div>
              <strong>{p.name}</strong>
            </span>
            <span className={styles.scoreCell}>
              <span className={styles.scoreBig} style={{ color: getRiskColor(p.risk) }}>{p.current}</span>
              <span className={styles.scoreMax}>/30</span>
            </span>
            <span>
              <span className={styles.riskBadge} style={{ background: getRiskBg(p.risk), color: getRiskColor(p.risk) }}>
                {p.risk.toUpperCase()}
              </span>
            </span>
            <span className={styles.trendCell}>
              {p.trend === 'rising' && <><TrendingUp size={16} color="#e74c3c" /> Rising</>}
              {p.trend === 'stable' && <><span style={{ color: '#95a5a6' }}>—</span> Stable</>}
              {p.trend === 'improving' && <><TrendingDown size={16} color="#2ecc71" /> Improving</>}
            </span>
            <span className={styles.dateCell}><Clock size={14} /> {p.lastScreened}</span>
            <span className={styles.miniChart}>
              {p.scores.map((s, i) => (
                <div key={i} className={styles.miniBar} style={{ height: `${(s / 30) * 100}%`, background: s > 12 ? '#e74c3c' : s > 8 ? '#f39c12' : '#2ecc71' }} />
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* Edinburgh Scale Reference */}
      <div className={styles.referenceCard}>
        <h3>Edinburgh Postnatal Depression Scale (EPDS)</h3>
        <p>10-item self-report questionnaire • Validated by WHO • Score range 0-30</p>
        <div className={styles.scaleBar}>
          <div className={styles.scaleSegment} style={{ background: '#2ecc71', flex: 8 }}><span>0-8 Low</span></div>
          <div className={styles.scaleSegment} style={{ background: '#f39c12', flex: 4 }}><span>9-12 Moderate</span></div>
          <div className={styles.scaleSegment} style={{ background: '#e74c3c', flex: 7 }}><span>13-19 High</span></div>
          <div className={styles.scaleSegment} style={{ background: '#9b59b6', flex: 11 }}><span>20+ Critical</span></div>
        </div>
        <p className={styles.citation}>Cox JL, Holden JM, Sagovsky R. (1987). British Journal of Psychiatry.</p>
      </div>
    </div>
  );
}
