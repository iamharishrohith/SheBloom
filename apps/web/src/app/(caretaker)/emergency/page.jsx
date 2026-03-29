'use client';

import { useState } from 'react';
import { PhoneCall, AlertTriangle, Ambulance, Stethoscope, Hospital, Info, ChevronDown, ChevronUp, Shield, Clock, CheckCircle2 } from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import styles from './emergency.module.css';

const RED_FLAGS = [
  { symptom: 'Vaginal Bleeding', desc: 'Any amount of bright red bleeding.', action: 'Go to Hospital Immediately', severity: 'critical',
    steps: ['Stay calm and lie down on left side', 'Note the amount and color of bleeding', 'Call 108 ambulance immediately', 'Do NOT insert anything vaginally'] },
  { symptom: 'Severe Headache + Vision Changes', desc: 'Headache that does not go away with rest, possibly with blurred vision or seeing spots.', action: 'Call Doctor Now (Preeclampsia risk)', severity: 'critical',
    steps: ['Check blood pressure if monitor available', 'Make her lie down in a quiet dark room', 'Call doctor immediately', 'If BP > 140/90, go to hospital'] },
  { symptom: 'Decreased Fetal Movement', desc: 'Less than 10 kicks/movements in 2 hours when she is resting.', action: 'Go to Hospital Immediately', severity: 'critical',
    steps: ['Have her drink cold water and lie on left side', 'Count movements for 2 hours', 'If less than 10, call doctor immediately', 'Go to hospital for Non-Stress Test (NST)'] },
  { symptom: 'Water Breaking', desc: 'Gush or continuous trickle of clear/yellowish fluid from the vagina.', action: 'Go to Hospital Immediately', severity: 'critical',
    steps: ['Note the time it started', 'Note the color (clear = normal, green/brown = urgent)', 'Do NOT take a bath', 'Go to hospital immediately'] },
  { symptom: 'Severe Abdominal Pain', desc: 'Persistent, intense abdominal pain not relieved by rest.', action: 'Call Doctor Urgently', severity: 'high',
    steps: ['Have her lie down comfortably', 'Note if pain is constant or comes and goes', 'Check for any bleeding', 'Call doctor or go to hospital'] },
  { symptom: 'High Fever (>101°F / 38.3°C)', desc: 'Fever that doesn\'t reduce with paracetamol.', action: 'Call Doctor Today', severity: 'high',
    steps: ['Give paracetamol (NOT ibuprofen)', 'Apply cool compresses', 'Ensure hydration', 'If fever persists > 4 hours, call doctor'] },
];

export default function EmergencyPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerIcon}><AlertTriangle size={32} /></div>
        <h1>Emergency Response</h1>
        <p>Immediate actions and doctor-verified red flags</p>
        <VerifyBadge level="doctor" size="md" />
      </header>

      {/* SOS Grid */}
      <section className={styles.sosGrid}>
        <a href="tel:108" className={`${styles.sosCard} ${styles.ambulance}`}>
          <Ambulance size={32} />
          <div className={styles.sosText}>
            <h3>Call Ambulance</h3>
            <span>Dial 108</span>
          </div>
        </a>
        <a href="tel:+1234567890" className={`${styles.sosCard} ${styles.doctor}`}>
          <Stethoscope size={32} />
          <div className={styles.sosText}>
            <h3>Call Doctor</h3>
            <span>Dr. Sarah Jenkins</span>
          </div>
        </a>
        <a href="https://maps.google.com" target="_blank" className={`${styles.sosCard} ${styles.hospital}`}>
          <Hospital size={32} />
          <div className={styles.sosText}>
            <h3>Navigate to Hospital</h3>
            <span>City Maternity Care</span>
          </div>
        </a>
      </section>

      {/* First Response Checklist */}
      <section className={styles.firstResponse}>
        <h2><Shield size={20} /> While Waiting for Help</h2>
        <div className={styles.checklistGrid}>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Stay calm — your composure helps her</div>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Keep her lying on her left side</div>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Have hospital bag ready by the door</div>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Gather all medical records & ID</div>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Note the time symptoms started</div>
          <div className={styles.checkItem}><CheckCircle2 size={16} /> Keep talking to her, reassure her</div>
        </div>
      </section>

      {/* Red Flags */}
      <section className={styles.guidelines}>
        <div className={styles.guideHeader}>
          <h2>When to Act Fast (Red Flags)</h2>
          <span className={styles.sourceLabel}><Info size={14} /> ACOG & WHO Guidelines</span>
        </div>

        <div className={styles.flagList}>
          {RED_FLAGS.map((flag, i) => (
            <div key={i} className={`${styles.flagCard} ${flag.severity === 'critical' ? styles.criticalFlag : styles.highFlag}`}>
              <div className={styles.flagMain} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className={styles.flagIndicator}></div>
                <div className={styles.flagContent}>
                  <h3>{flag.symptom}</h3>
                  <p>{flag.desc}</p>
                  <div className={styles.actionTag}>
                    <AlertTriangle size={14} />
                    {flag.action}
                  </div>
                </div>
                <div className={styles.flagExpand}>
                  {expanded === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
              {expanded === i && (
                <div className={styles.flagSteps}>
                  <strong><Clock size={14} /> What to do right now:</strong>
                  <ol>
                    {flag.steps.map((step, j) => <li key={j}>{step}</li>)}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
