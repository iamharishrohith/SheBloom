'use client';
import { useState } from 'react';
import { Sparkles, Heart, Brain, Coffee, Moon, Music, Dumbbell, Smile, CheckCircle2, Circle } from 'lucide-react';
import styles from './selfcare.module.css';

const REMINDERS = [
  { text: 'You are doing an incredible job. Not everyone shows up like this.', icon: Heart, color: '#b5838d' },
  { text: 'Taking care of yourself is NOT selfish — it\'s how you sustain care for her.', icon: Sparkles, color: '#e9c46a' },
  { text: 'Your mental health matters too. It\'s okay to feel overwhelmed sometimes.', icon: Brain, color: '#2a9d8f' },
  { text: 'She sees your effort even when she doesn\'t say it.', icon: Smile, color: '#f4845f' },
];

const SELF_CARE_TASKS = [
  { id: 1, task: 'Take a 10-minute break just for yourself', icon: Coffee, category: 'mental', time: '10 min' },
  { id: 2, task: 'Stretch or do light exercise for 15 minutes', icon: Dumbbell, category: 'physical', time: '15 min' },
  { id: 3, task: 'Listen to music you enjoy', icon: Music, category: 'emotional', time: '20 min' },
  { id: 4, task: 'Get at least 7 hours of sleep tonight', icon: Moon, category: 'physical', time: '7 hrs' },
  { id: 5, task: 'Talk to a friend or family member about how YOU feel', icon: Heart, category: 'emotional', time: '15 min' },
  { id: 6, task: 'Eat a proper meal (not just leftovers)', icon: Coffee, category: 'physical', time: '20 min' },
];

export default function SelfcarePage() {
  const [completed, setCompleted] = useState(new Set());
  const [currentReminder, setCurrentReminder] = useState(0);

  const toggle = (id) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const nextReminder = () => setCurrentReminder((currentReminder + 1) % REMINDERS.length);

  const ReminderIcon = REMINDERS[currentReminder].icon;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerIcon}><Sparkles size={32} /></div>
        <h1>You Matter Too</h1>
        <p>Taking care of yourself IS taking care of her</p>
      </header>

      {/* Affirmation Card */}
      <div className={styles.affirmation} onClick={nextReminder} style={{ borderColor: REMINDERS[currentReminder].color + '40' }}>
        <ReminderIcon size={28} style={{ color: REMINDERS[currentReminder].color }} />
        <p className={styles.affirmationText}>{REMINDERS[currentReminder].text}</p>
        <span className={styles.tapHint}>Tap for another ↻</span>
      </div>

      {/* Self-Care Checklist */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Today's Self-Care</h2>
        <p className={styles.sectionSub}>Check off at least 3 today</p>

        <div className={styles.progressRow}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(completed.size / SELF_CARE_TASKS.length) * 100}%` }} />
          </div>
          <span className={styles.progressText}>{completed.size}/{SELF_CARE_TASKS.length}</span>
        </div>

        <div className={styles.taskList}>
          {SELF_CARE_TASKS.map(task => {
            const Icon = task.icon;
            const isDone = completed.has(task.id);
            return (
              <div key={task.id} className={`${styles.taskCard} ${isDone ? styles.done : ''}`} onClick={() => toggle(task.id)}>
                <div className={styles.taskIcon}>
                  <Icon size={20} />
                </div>
                <div className={styles.taskContent}>
                  <p className={styles.taskText}>{task.task}</p>
                  <span className={styles.taskTime}>{task.time}</span>
                </div>
                <div className={styles.taskCheck}>
                  {isDone ? <CheckCircle2 size={22} color="var(--color-success)" /> : <Circle size={22} />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Resources */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>If You're Struggling</h2>
        <div className={styles.resourceGrid}>
          <a href="tel:08046110007" className={styles.resourceCard}>
            <strong>NIMHANS Helpline</strong>
            <span>080-46110007</span>
          </a>
          <a href="tel:9152987821" className={styles.resourceCard}>
            <strong>iCall (TISS)</strong>
            <span>9152987821</span>
          </a>
          <a href="tel:18005990019" className={styles.resourceCard}>
            <strong>Vandrevala Foundation</strong>
            <span>1800-599-0019 (24/7)</span>
          </a>
        </div>
        <p className={styles.resourceNote}>Caretaker burnout is real. Asking for help is strength, not weakness.</p>
      </section>
    </div>
  );
}
