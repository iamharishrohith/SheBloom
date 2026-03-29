'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CalendarClock, Pill, UtensilsCrossed, Droplets, Footprints,
  Heart, Moon, MessageCircle, Baby, Activity, HeartPulse,
  CheckCircle, Circle, Apple, Wifi, WifiOff, Volume2
} from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import styles from './timeline.module.css';

const ICON_MAP = {
  pill: Pill, utensils: UtensilsCrossed, droplet: Droplets, footprints: Footprints,
  heart: Heart, moon: Moon, 'message-circle': MessageCircle, baby: Baby,
  activity: Activity, 'heart-pulse': HeartPulse, apple: Apple,
  'cooking-pot': UtensilsCrossed, ear: Heart
};

const TIMELINE = [
  { time: '06:30', task: 'Ensure Priya takes iron + folic acid with vitamin C', icon: 'pill', duration: '5min', gap: 'nutrition', verified: 'doctor', citation: 'WHO ANC Recommendations', id: '1' },
  { time: '07:00', task: 'Prepare nutrient-rich breakfast before leaving', icon: 'utensils', duration: '20min', gap: 'nutrition', verified: 'evidence', id: '2' },
  { time: '10:00', task: 'Send a caring message to Priya', icon: 'message-circle', duration: '2min', gap: 'emotional', verified: 'evidence', citation: 'Emotional support reduces PPD risk by 40%', id: '3' },
  { time: '10:30', task: 'Iron-rich snack: dates + almonds + jaggery', icon: 'apple', duration: '5min', gap: 'nutrition', verified: 'doctor', citation: 'NHM Anemia Mukt Bharat', condition: 'Anemia Management', id: '4' },
  { time: '13:00', task: 'Remind Priya about water intake (target: 3L today)', icon: 'droplet', duration: '1min', gap: 'action', verified: 'doctor', citation: 'WHO: 2.3–3L daily during pregnancy', id: '5' },
  { time: '18:30', task: 'Evening walk together (20-30 min, gentle pace)', icon: 'footprints', duration: '30min', gap: 'action', verified: 'doctor', citation: 'ACOG: 150 min/week moderate exercise', id: '6' },
  { time: '19:30', task: "Cook dinner from today's meal plan", icon: 'utensils', duration: '45min', gap: 'nutrition', verified: 'evidence', id: '7' },
  { time: '21:00', task: "Relaxation time — check how she's feeling emotionally", icon: 'heart', duration: '15min', gap: 'emotional', verified: 'evidence', id: '8' },
  { time: '21:30', task: 'Ensure calcium supplement (separate from iron by 2hrs)', icon: 'pill', duration: '2min', gap: 'nutrition', verified: 'doctor', citation: 'ICMR: Calcium + Iron 2 hours apart', id: '9' },
];

export default function TimelinePage() {
  const [completed, setCompleted] = useState(new Set());
  const [synced, setSynced] = useState(false);
  const [missedAlert, setMissedAlert] = useState(null);
  const wsRef = useRef(null);

  // Connect WebSocket for compliance sync
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/api/iot/stream');
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', role: 'caretaker' }));
    return () => ws.close();
  }, []);

  // Check for missed tasks every minute
  useEffect(() => {
    const checkMissed = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const missedItems = TIMELINE.filter(t => {
        const [h, m] = t.time.split(':').map(Number);
        const taskTime = h * 60 + m;
        return taskTime < currentTime && !completed.has(t.id);
      });
      if (missedItems.length > 0) {
        setMissedAlert(`${missedItems.length} task${missedItems.length > 1 ? 's' : ''} overdue. Most recent: "${missedItems[missedItems.length - 1].task}"`);
      } else {
        setMissedAlert(null);
      }
    };
    checkMissed();
    const interval = setInterval(checkMissed, 60000);
    return () => clearInterval(interval);
  }, [completed]);

  function toggleTask(id) {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Sync to backend via WebSocket
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'compliance_update',
            taskId: id,
            status: 'completed',
            completedAt: new Date().toISOString(),
          }));
          setSynced(true);
          setTimeout(() => setSynced(false), 1500);
        }
      }
      return next;
    });
  }

  const conditionTasks = TIMELINE.filter(t => t.condition);
  const complianceRate = Math.round((completed.size / TIMELINE.length) * 100);

  // Determine current block
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.label}>Doctor Verified Care Plan</p>
        <h1 className={styles.title}>
          <CalendarClock size={28} />
          Rohith's Daily Care Timeline
        </h1>
        <p className={styles.subtitle}>
          Personalized for Priya — every suggestion is medically verified.
          <VerifyBadge level="doctor" size="lg" />
        </p>
      </div>

      {/* Missed task alert */}
      {missedAlert && (
        <div className={styles.missedAlert}>
          <Volume2 size={16} />
          <span>{missedAlert}</span>
        </div>
      )}

      {/* Sync indicator */}
      {synced && (
        <div className={styles.syncToast}>
          <CheckCircle size={14} /> Synced with doctor dashboard
        </div>
      )}

      {/* Summary card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryTop}>
          <div>
            <p className={styles.summaryLabel}>Today's schedule based on your 9-to-6 work routine</p>
            <h2 className={styles.summaryCount}>{TIMELINE.length} care tasks for today</h2>
            {conditionTasks.length > 0 && (
              <p className={styles.summaryCondition}>Includes {conditionTasks.length} condition-specific task{conditionTasks.length > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className={styles.complianceCircle}>
            <svg viewBox="0 0 80 80" className={styles.compRing}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-secondary-light)" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={complianceRate >= 70 ? 'var(--color-primary)' : 'var(--color-danger)'} strokeWidth="6"
                strokeDasharray={`${complianceRate * 2.136} ${213.6 - complianceRate * 2.136}`}
                strokeDashoffset="53.4" strokeLinecap="round" />
            </svg>
            <span className={styles.compValue}>{complianceRate}%</span>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${complianceRate}%` }}></div>
        </div>
        <p className={styles.progressText}>{completed.size}/{TIMELINE.length} completed</p>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {TIMELINE.map((item) => {
          const Icon = ICON_MAP[item.icon] || Circle;
          const isDone = completed.has(item.id);
          const [h, m] = item.time.split(':').map(Number);
          const taskMin = h * 60 + m;
          const isOverdue = taskMin < currentMinutes && !isDone;
          const isCurrent = Math.abs(taskMin - currentMinutes) < 30 && !isDone;

          return (
            <div key={item.id} className={`${styles.timelineItem} ${isDone ? styles.done : ''} ${isOverdue ? styles.overdue : ''} ${isCurrent ? styles.current : ''}`}>
              <div className={styles.timeCol}>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.duration}>{item.duration}</span>
              </div>
              <div className={styles.iconCol} data-gap={item.gap}>
                <Icon size={18} />
              </div>
              <div className={styles.contentCol}>
                <p className={styles.taskText}>{item.task}</p>
                <div className={styles.taskMeta}>
                  <VerifyBadge level={item.verified} citation={item.citation} />
                  {item.citation && <span className={styles.citationText}>Source: {item.citation}</span>}
                </div>
                {item.condition && (
                  <span className={styles.conditionTag}>{item.condition}</span>
                )}
                {isOverdue && <span className={styles.overdueTag}>Overdue</span>}
              </div>
              <button className={styles.checkBtn} onClick={() => toggleTask(item.id)}>
                {isDone ? <CheckCircle size={22} /> : <Circle size={22} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
