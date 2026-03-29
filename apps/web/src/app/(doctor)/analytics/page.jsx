'use client';
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Pill, Heart, Footprints, Droplets, Users } from 'lucide-react';
import styles from './analytics.module.css';

const GAP_ANALYSIS = [
  { gap: 'Medication', icon: Pill, missed: 12, total: 70, color: '#e74c3c' },
  { gap: 'Nutrition', icon: Droplets, missed: 8, total: 56, color: '#f39c12' },
  { gap: 'Emotional', icon: Heart, missed: 5, total: 28, color: '#9b59b6' },
  { gap: 'Activity', icon: Footprints, missed: 3, total: 42, color: '#3498db' },
];

const WEEKLY_TREND = [
  { week: 'W1', rate: 68 }, { week: 'W2', rate: 72 }, { week: 'W3', rate: 78 },
  { week: 'W4', rate: 82 }, { week: 'W5', rate: 75 }, { week: 'W6', rate: 88 }, { week: 'W7', rate: 91 },
];

const PATIENT_COMP = [
  { name: 'Priya S.', rate: 85 }, { name: 'Anita R.', rate: 72 },
  { name: 'Meera K.', rate: 94 }, { name: 'Lakshmi P.', rate: 68 },
  { name: 'Divya N.', rate: 91 },
];

export default function AnalyticsPage() {
  const overallCompliance = 82;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1><BarChart3 size={28} /> Compliance Analytics</h1>
        <p>Care quality insights across all active patients</p>
      </header>

      {/* Top Stats */}
      <div className={styles.topStats}>
        <div className={styles.bigStat}>
          <div className={styles.bigStatCircle}>
            <svg viewBox="0 0 100 100" className={styles.progressRing}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-secondary-light)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-primary)" strokeWidth="8"
                strokeDasharray={`${overallCompliance * 2.64} ${264 - overallCompliance * 2.64}`}
                strokeDashoffset="66" strokeLinecap="round" />
            </svg>
            <span className={styles.bigStatValue}>{overallCompliance}%</span>
          </div>
          <span className={styles.bigStatLabel}>Overall Compliance</span>
        </div>
        <div className={styles.miniStats}>
          <div className={styles.miniStat}><Users size={18} /><div><strong>5</strong><span>Active Patients</span></div></div>
          <div className={styles.miniStat}><AlertTriangle size={18} color="var(--color-danger)" /><div><strong>1</strong><span>Critical (&lt;70%)</span></div></div>
          <div className={styles.miniStat}><TrendingUp size={18} color="var(--color-success)" /><div><strong>+9%</strong><span>vs Last Week</span></div></div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Weekly Trend */}
        <div className={styles.chartPanel}>
          <h3><TrendingUp size={18} /> Weekly Compliance Trend</h3>
          <div className={styles.lineChart}>
            {WEEKLY_TREND.map((d, i) => (
              <div key={i} className={styles.lineCol}>
                <div className={styles.lineBarWrap}>
                  <div className={styles.lineBar} style={{ height: `${d.rate}%`, background: d.rate < 75 ? 'var(--color-warning)' : 'var(--color-primary)' }} />
                </div>
                <span className={styles.lineLabel}>{d.week}</span>
                <span className={styles.lineValue}>{d.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gap Analysis */}
        <div className={styles.chartPanel}>
          <h3><AlertTriangle size={18} /> Gap Analysis</h3>
          <p className={styles.chartSub}>Which care types are most commonly missed</p>
          <div className={styles.gapList}>
            {GAP_ANALYSIS.map((g, i) => {
              const Icon = g.icon;
              const rate = Math.round(((g.total - g.missed) / g.total) * 100);
              return (
                <div key={i} className={styles.gapItem}>
                  <div className={styles.gapIcon} style={{ color: g.color }}><Icon size={18} /></div>
                  <div className={styles.gapInfo}>
                    <div className={styles.gapHeader}>
                      <span>{g.gap}</span>
                      <span style={{ color: rate < 80 ? 'var(--color-danger)' : 'var(--color-primary)', fontWeight: 700 }}>{rate}%</span>
                    </div>
                    <div className={styles.gapBar}>
                      <div className={styles.gapFill} style={{ width: `${rate}%`, background: g.color }} />
                    </div>
                    <span className={styles.gapMeta}>{g.missed} missed of {g.total} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Per-Patient */}
      <div className={styles.chartPanel}>
        <h3><Users size={18} /> Per-Patient Compliance</h3>
        <div className={styles.patientBars}>
          {PATIENT_COMP.sort((a, b) => b.rate - a.rate).map((p, i) => (
            <div key={i} className={styles.patientBar}>
              <span className={styles.patientName}>{p.name}</span>
              <div className={styles.patientBarTrack}>
                <div className={styles.patientBarFill} style={{ width: `${p.rate}%`, background: p.rate < 75 ? 'var(--color-danger)' : 'var(--color-primary)' }} />
              </div>
              <span className={styles.patientRate} style={{ color: p.rate < 75 ? 'var(--color-danger)' : 'var(--color-primary)' }}>{p.rate}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
