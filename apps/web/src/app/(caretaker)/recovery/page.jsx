'use client';

import { useState } from 'react';
import {
  HeartPulse, Brain, ShieldCheck, Baby, Dumbbell,
  Sun, Trophy, ClipboardCheck, ChevronRight
} from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import styles from './recovery.module.css';

const PHASES = [
  { name: 'Healing Phase', weeks: '0-2 weeks', focus: 'Physical recovery + wound monitoring', Icon: HeartPulse, color: '#e07a5f', verified: 'doctor' },
  { name: 'Adjusting Phase', weeks: '2-6 weeks', focus: 'Breastfeeding + sleep patterns + PPD watch', Icon: Baby, color: '#e9c46a', verified: 'doctor' },
  { name: 'Rebuilding Phase', weeks: '6-12 weeks', focus: 'Pelvic floor recovery + gentle exercise', Icon: Dumbbell, color: '#6a994e', verified: 'doctor' },
  { name: 'Reclaiming Phase', weeks: '3-6 months', focus: 'Hormonal balance + identity + relationships', Icon: Sun, color: '#2a9d8f', verified: 'evidence' },
  { name: 'Thriving Phase', weeks: '6-12 months', focus: 'Full recovery validation + family planning', Icon: Trophy, color: '#2d6a4f', verified: 'evidence' },
];

const PPD_QUESTIONS = [
  { q: 'I have been able to laugh and see the funny side of things', opts: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
  { q: 'I have looked forward with enjoyment to things', opts: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'] },
  { q: 'I have blamed myself unnecessarily when things went wrong', opts: ['No, never', 'Not very often', 'Yes, some of the time', 'Yes, most of the time'] },
  { q: 'I have been anxious or worried for no good reason', opts: ['No, not at all', 'Hardly ever', 'Yes, sometimes', 'Yes, very often'] },
  { q: 'I have felt scared or panicky for no very good reason', opts: ['No, not at all', 'No, not much', 'Yes, sometimes', 'Yes, quite a lot'] },
  { q: 'Things have been getting on top of me', opts: ['No, I have been coping', 'No, most of the time I cope', "Yes, sometimes I haven't been coping", "Yes, most of the time I haven't been coping"] },
  { q: 'I have been so unhappy that I have had difficulty sleeping', opts: ['No, not at all', 'Not very often', 'Yes, sometimes', 'Yes, most of the time'] },
  { q: 'I have felt sad or miserable', opts: ['No, not at all', 'Not very often', 'Yes, quite often', 'Yes, most of the time'] },
  { q: 'I have been so unhappy that I have been crying', opts: ['No, never', 'Only occasionally', 'Yes, quite often', 'Yes, most of the time'] },
  { q: 'The thought of harming myself has occurred to me', opts: ['Never', 'Hardly ever', 'Sometimes', 'Yes, quite often'] },
];

function getPPDResult(score) {
  if (score <= 8) return { label: 'Low Risk', color: '#2d6a4f', msg: 'Scores in this range are normal. Continue monitoring weekly.' };
  if (score <= 12) return { label: 'Possible Depression', color: '#e9c46a', msg: 'Score suggests possible depression. Discuss with doctor at next visit.' };
  if (score <= 19) return { label: 'Likely Depression', color: '#e07a5f', msg: 'Score indicates probable depression. Contact healthcare provider this week.' };
  return { label: 'Severe — Seek Help Now', color: '#d62828', msg: 'Please contact your doctor or NIMHANS Helpline TODAY: 080-46110007' };
}

export default function RecoveryPage() {
  const [showPPD, setShowPPD] = useState(false);
  const [ppdStep, setPpdStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  function handleAnswer(score) {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (ppdStep < 9) {
      setPpdStep(ppdStep + 1);
    } else {
      const total = newAnswers.reduce((a, b) => a + b, 0);
      setResult({ score: total, ...getPPDResult(total) });
    }
  }

  function resetPPD() {
    setShowPPD(false);
    setPpdStep(0);
    setAnswers([]);
    setResult(null);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.label}>Doctor Verified</p>
        <h1 className={styles.title}>
          <HeartPulse size={28} />
          Postpartum Recovery
        </h1>
        <p className={styles.subtitle}>
          The journey doesn't end at delivery — it starts a new chapter.
          <VerifyBadge level="doctor" size="lg" />
        </p>
      </div>

      {/* PPD Screening Card */}
      <div className={styles.ppdCard}>
        <div className={styles.ppdHeader}>
          <Brain size={24} />
          <div>
            <h3>PPD Screening (Edinburgh Scale)</h3>
            <p className={styles.ppdCitation}>Cox JL, Holden JM, Sagovsky R. (1987). Br J Psychiatry. WHO-recommended screening tool.</p>
          </div>
          <VerifyBadge level="doctor" />
        </div>

        {!showPPD && !result && (
          <>
            <p className={styles.ppdDesc}>
              Postpartum depression affects 1 in 7 mothers. Early detection saves lives. 
              Take the screening weekly during the first 6 months.
            </p>
            <button className={styles.ppdBtn} onClick={() => setShowPPD(true)}>
              <ClipboardCheck size={18} />
              Take PPD Screening
            </button>
          </>
        )}

        {showPPD && !result && (
          <div className={styles.ppdQuiz}>
            <div className={styles.ppdProgress}>
              <div className={styles.ppdProgressFill} style={{ width: `${((ppdStep + 1) / 10) * 100}%` }}></div>
            </div>
            <p className={styles.ppdStep}>Question {ppdStep + 1} of 10</p>
            <h4 className={styles.ppdQuestion}>{PPD_QUESTIONS[ppdStep].q}</h4>
            <p className={styles.ppdInstruction}>In the past 7 days:</p>
            <div className={styles.ppdOptions}>
              {PPD_QUESTIONS[ppdStep].opts.map((opt, i) => (
                <button key={i} className={styles.ppdOption} onClick={() => handleAnswer(i)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={styles.ppdResult}>
            <div className={styles.ppdScore} style={{ borderColor: result.color }}>
              <span className={styles.ppdScoreNum} style={{ color: result.color }}>{result.score}</span>
              <span className={styles.ppdScoreMax}>/30</span>
            </div>
            <h4 style={{ color: result.color }}>{result.label}</h4>
            <p className={styles.ppdMsg}>{result.msg}</p>
            <button className={styles.ppdBtn} onClick={resetPPD} style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-primary)' }}>
              Take Again
            </button>
          </div>
        )}
      </div>

      {/* Recovery Phases */}
      <h2 className={styles.sectionTitle}>Recovery Phases (Weeks 0–52)</h2>
      <div className={styles.phaseList}>
        {PHASES.map((phase, i) => (
          <div key={i} className={styles.phaseCard}>
            <div className={styles.phaseIcon} style={{ background: `${phase.color}18`, color: phase.color }}>
              <phase.Icon size={22} />
            </div>
            <div className={styles.phaseContent}>
              <h3>{phase.name}</h3>
              <p className={styles.phaseWeeks}>{phase.weeks}</p>
              <p className={styles.phaseFocus}>{phase.focus}</p>
            </div>
            <VerifyBadge level={phase.verified} />
            <ChevronRight size={18} className={styles.phaseArrow} />
          </div>
        ))}
      </div>
    </div>
  );
}
