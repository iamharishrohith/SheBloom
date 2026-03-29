'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Baby, Heart, Pill, FileText, Activity, CheckCircle2,
  AlertTriangle, Calendar, Clock, ThermometerSun, Droplets, Wind, TrendingUp,
  Stethoscope, Save
} from 'lucide-react';
import styles from './detail.module.css';

// Demo data (will be replaced by API fetch)
const DEMO_NOTES = [
  { date: '2026-03-28', text: 'Iron levels improving. Continue current dosage. Next blood test in 2 weeks.', doctor: 'Dr. Sarah Jenkins' },
  { date: '2026-03-20', text: 'Anemia confirmed. Started Ferrous Sulfate 200mg 2x/day. Added Vitamin C supplement.', doctor: 'Dr. Sarah Jenkins' },
];

const DEMO_TASKS = [
  { time: '06:30', task: 'Iron + Folic Acid', completed: true },
  { time: '07:00', task: 'Breakfast preparation', completed: true },
  { time: '10:00', task: 'Caring message', completed: false },
  { time: '10:30', task: 'Iron-rich snack', completed: false },
  { time: '13:00', task: 'Water reminder', completed: false },
  { time: '18:30', task: 'Evening walk', completed: false },
  { time: '21:30', task: 'Calcium supplement', completed: false },
];

const WEEKLY_COMPLIANCE = [
  { week: 'Mon', rate: 85 }, { week: 'Tue', rate: 72 }, { week: 'Wed', rate: 90 },
  { week: 'Thu', rate: 68 }, { week: 'Fri', rate: 95 }, { week: 'Sat', rate: 80 }, { week: 'Sun', rate: 88 },
];

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkupTime, setCheckupTime] = useState('10:00');
  const [checkupNotes, setCheckupNotes] = useState('');
  const [checkups, setCheckups] = useState([
    { date: '2026-03-15', time: '11:00', doctor: 'Dr. Sarah Jenkins', notes: 'Routine second trimester checkup. Everything looks normal.' }
  ]);

  useEffect(() => {
    fetch('http://localhost:4000/api/doctor/patients')
      .then(res => res.json())
      .then(data => {
        const p = (Array.isArray(data) ? data : []).find(x => String(x.id) === String(params.id));
        setPatient(p || { id: params.id, maternalName: 'Patient', trimester: 2, complianceRate: 85, conditions: [], ppdRiskLevel: 'low', dueDate: '2026-08-15' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className={styles.loading}>Loading patient data...</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'checkups', label: 'Checkups', icon: Stethoscope },
    { id: 'timeline', label: 'Today\'s Tasks', icon: Calendar },
    { id: 'notes', label: 'Clinical Notes', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: TrendingUp },
  ];

  const handleLogCheckup = () => {
    alert(`Checkup logged for ${checkupTime}. Alert sent to Caretaker's timeline.`);
    setCheckups([
      { date: new Date().toISOString().split('T')[0], time: checkupTime, doctor: 'Dr. Sarah Jenkins', notes: checkupNotes },
      ...checkups
    ]);
    setCheckupNotes('');
  };

  const completedToday = DEMO_TASKS.filter(t => t.completed).length;
  const totalToday = DEMO_TASKS.length;

  return (
    <div className={styles.page}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => window.location.href = '/patients'}>
        <ArrowLeft size={18} /> Back to Patients
      </button>

      {/* Patient Header */}
      <div className={styles.patientHeader}>
        <div className={styles.patientAvatar}>{patient?.maternalName?.charAt(0)}</div>
        <div className={styles.patientMeta}>
          <h1>{patient?.maternalName}</h1>
          <div className={styles.metaTags}>
            <span className={styles.metaTag}><Baby size={14} /> Trimester {patient?.trimester}</span>
            <span className={styles.metaTag}><Calendar size={14} /> EDD: {new Date(patient?.dueDate).toLocaleDateString()}</span>
            <span className={`${styles.riskBadge} ${patient?.ppdRiskLevel === 'low' ? styles.riskLow : styles.riskHigh}`}>
              PPD: {patient?.ppdRiskLevel?.toUpperCase()}
            </span>
          </div>
          {patient?.conditions?.length > 0 && (
            <div className={styles.conditionRow}>
              {patient.conditions.map(c => <span key={c} className={styles.condTag}>{c}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Today's Compliance</span>
          <span className={styles.statValue}>{Math.round((completedToday / totalToday) * 100)}%</span>
          <span className={styles.statSub}>{completedToday}/{totalToday} tasks done</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Weekly Average</span>
          <span className={styles.statValue}>{patient?.complianceRate || 85}%</span>
          <span className={styles.statSub}>Last 7 days</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>PPD Score</span>
          <span className={styles.statValue}>6/30</span>
          <span className={styles.statSub}>Low risk</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Days to Due</span>
          <span className={styles.statValue}>{Math.max(0, Math.ceil((new Date(patient?.dueDate) - new Date()) / 86400000))}</span>
          <span className={styles.statSub}>remaining</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.panel}>
              <h3><Pill size={18} /> Active Prescriptions</h3>
              <div className={styles.rxList}>
                <div className={styles.rxItem}><Pill size={16} /><div><strong>Ferrous Sulfate 200mg</strong><span>2x/day — Morning & Evening</span></div></div>
                <div className={styles.rxItem}><Pill size={16} /><div><strong>Folic Acid 5mg</strong><span>1x/day — Morning</span></div></div>
                <div className={styles.rxItem}><Pill size={16} /><div><strong>Calcium 500mg</strong><span>1x/day — Night (2hrs after iron)</span></div></div>
              </div>
            </div>
            <div className={styles.panel}>
              <h3><FileText size={18} /> Latest Note</h3>
              <div className={styles.noteCard}>
                <div className={styles.noteDate}>{DEMO_NOTES[0].date} — {DEMO_NOTES[0].doctor}</div>
                <p>{DEMO_NOTES[0].text}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checkups' && (
          <div className={styles.checkupsTab}>
            <div className={styles.logCheckupBox} style={{ background: 'var(--color-bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(183, 228, 199, 0.5)', marginBottom: 'var(--space-2xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--color-primary)" /> Log Today's Checkup Attendance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-tiny)', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Time of Visit</label>
                  <input type="time" value={checkupTime} onChange={e => setCheckupTime(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-primary-muted)', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-tiny)', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Brief Observation Notes (Optional)</label>
                  <input type="text" value={checkupNotes} onChange={e => setCheckupNotes(e.target.value)} placeholder="e.g. Vitals normal, swelling reduced" style={{ width: '100%', padding: '8px', border: '1px solid var(--color-primary-muted)', borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>
              <button onClick={handleLogCheckup} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-pill)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> Approve & Log Attendance
              </button>
            </div>

            <h3 style={{ marginBottom: 'var(--space-md)' }}>Checkup History</h3>
            <div className={styles.notesList}>
              {checkups.map((c, i) => (
                <div key={i} className={styles.noteCard}>
                  <div className={styles.noteDate}>{c.date} at {c.time} — {c.doctor}</div>
                  <p>{c.notes || 'No notes provided.'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className={styles.timelineList}>
            {DEMO_TASKS.map((t, i) => (
              <div key={i} className={`${styles.taskItem} ${t.completed ? styles.taskDone : ''}`}>
                <div className={styles.taskTime}>{t.time}</div>
                <div className={styles.taskIcon}>
                  {t.completed ? <CheckCircle2 size={20} color="var(--color-success)" /> : <Clock size={20} color="var(--color-text-muted)" />}
                </div>
                <div className={styles.taskText}>{t.task}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className={styles.notesList}>
            {DEMO_NOTES.map((n, i) => (
              <div key={i} className={styles.noteCard}>
                <div className={styles.noteDate}>{n.date} — {n.doctor}</div>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className={styles.complianceView}>
            <h3>Weekly Compliance Trend</h3>
            <div className={styles.barChart}>
              {WEEKLY_COMPLIANCE.map((d, i) => (
                <div key={i} className={styles.barCol}>
                  <div className={styles.barWrap}>
                    <div className={styles.bar} style={{ height: `${d.rate}%`, background: d.rate < 70 ? 'var(--color-danger)' : 'var(--color-primary)' }} />
                  </div>
                  <span className={styles.barLabel}>{d.week}</span>
                  <span className={styles.barValue}>{d.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
