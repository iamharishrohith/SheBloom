'use client';
import React, { useEffect, useState } from 'react';
import {
  Activity, FileText, CheckCircle2, AlertTriangle, X, Clock, Pill,
  ThermometerSun, Droplets, Wind, Users, TrendingUp, Bell, ArrowRight, Wifi
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveEnv, setLiveEnv] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [clinicalNote, setClinicalNote] = useState('');
  const [savedNotes, setSavedNotes] = useState({});

  useEffect(() => {
    fetch('http://localhost:4000/api/doctor/patients')
      .then(res => res.json())
      .then(data => { setPatients(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));

    const ws = new WebSocket('ws://localhost:4000/api/iot/stream');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', role: 'doctor' }));
    };
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === 'environment_update') {
        setLiveEnv(payload.data);
      }
      if (payload.event === 'environment_alert') {
        setAlerts(prev => [payload, ...prev].slice(0, 5));
      }
    };
    return () => ws.close();
  }, []);

  const openNotes = (patient) => {
    setSelectedPatient(patient);
    setClinicalNote(savedNotes[patient.id] || '');
    setShowNotesModal(true);
  };

  const saveNote = () => {
    setSavedNotes(prev => ({ ...prev, [selectedPatient.id]: clinicalNote }));
    setShowNotesModal(false);
  };

  const criticalCount = patients.filter(p => p.complianceRate < 50).length;
  const avgCompliance = patients.length > 0
    ? Math.round(patients.reduce((a, p) => a + p.complianceRate, 0) / patients.length)
    : 100;

  if (loading) return <div className={styles.loading}>Authorizing Clinical Access...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h2>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, <span>Doctor</span></h2>
        </div>
        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={() => window.location.href='/onboarding'}>
            + New Care Circle
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className={styles.alertBanner}>
            <AlertTriangle size={18} />
            <span>{alerts[0].message}</span>
            <button onClick={() => setAlerts(prev => prev.slice(1))} className={styles.alertDismiss}><X size={16} /></button>
          </div>
        )}

        {/* Stats Row */}
        <div className={styles.summaryBar}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Active Circles</span>
            <span className={styles.statValue}>{patients.length}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Avg Compliance</span>
            <span className={styles.statValue}>{avgCompliance}%</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Critical Alerts</span>
            <span className={styles.statValue} style={{ color: criticalCount > 0 ? 'var(--color-danger)' : undefined }}>{criticalCount}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>IoT Devices</span>
            <span className={styles.statValue}>
              {liveEnv ? <span style={{ color: 'var(--color-success)', fontSize: '1.5rem' }}>● 1</span> : '—'}
            </span>
          </div>
        </div>

        {/* Live IoT Environment Panel */}
        {liveEnv && (
          <div className={styles.iotPanel}>
            <div className={styles.iotPanelHeader}>
              <Wifi size={16} />
              <span>Live Room Environment</span>
              <span className={styles.iotLive}>● LIVE</span>
            </div>
            <div className={styles.iotGrid}>
              <div className={styles.iotMetric}>
                <ThermometerSun size={22} />
                <div>
                  <span className={styles.iotValue}>{liveEnv.temperature}°C</span>
                  <span className={styles.iotLabel}>Temperature</span>
                </div>
              </div>
              <div className={styles.iotMetric}>
                <Droplets size={22} />
                <div>
                  <span className={styles.iotValue}>{liveEnv.humidity}%</span>
                  <span className={styles.iotLabel}>Humidity</span>
                </div>
              </div>
              <div className={styles.iotMetric}>
                <Wind size={22} />
                <div>
                  <span className={styles.iotValue}>{liveEnv.airQuality?.ppm || '—'} PPM</span>
                  <span className={styles.iotLabel}>Air Quality: {liveEnv.airQuality?.level || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Grid */}
        <div className={styles.patientGrid}>
          {patients.map(p => {
            const isCritical = p.complianceRate < 50;
            return (
              <div key={p.id} className={styles.patientCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.patientInfo}>
                    <h3>{p.maternalName}</h3>
                    <p>Trimester {p.trimester} • EDD: {new Date(p.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`${styles.riskBadge} ${p.ppdRiskLevel === 'low' ? styles.lowRisk : styles.highRisk}`}>
                    PPD: {p.ppdRiskLevel?.toUpperCase()}
                  </div>
                </div>

                {p.conditions?.length > 0 && (
                  <div className={styles.conditions}>
                    {p.conditions.map(c => <span key={c} className={styles.conditionTag}>{c}</span>)}
                  </div>
                )}

                <div className={styles.metricsRow}>
                  <div className={styles.metric}>
                    {isCritical ? <AlertTriangle size={16} color="var(--color-danger)" /> : <CheckCircle2 size={16} color="var(--color-success)" />}
                    <div>
                      <span className={styles.metricLabel}>Compliance</span>
                      <span className={styles.metricValue} style={{ color: isCritical ? 'var(--color-danger)' : 'var(--color-primary-dark)' }}>
                        {p.complianceRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.actionBtn} onClick={() => openNotes(p)}>
                    <FileText size={16} /> Notes
                  </button>
                  <button className={styles.actionBtnPrimary} onClick={() => window.location.href = `/patients/${p.id}`}>
                    <ArrowRight size={16} /> Details
                  </button>
                </div>
              </div>
            );
          })}

          {patients.length === 0 && (
            <div className={styles.emptyState}>
              <Users size={48} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }} />
              <p>No active care circles. Provision a new patient to begin monitoring.</p>
              <button className={styles.primaryButton} onClick={() => window.location.href='/onboarding'}>+ Add First Patient</button>
            </div>
          )}
        </div>
      </main>

      {/* Clinical Notes Modal */}
      {showNotesModal && selectedPatient && (
        <div className={styles.modalOverlay} onClick={() => setShowNotesModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3><FileText size={20} /> Clinical Notes — {selectedPatient.maternalName}</h3>
              <button className={styles.closeBtn} onClick={() => setShowNotesModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.notesMeta}>
                <span><Clock size={14} /> {new Date().toLocaleDateString()}</span>
                <span><Pill size={14} /> Trimester {selectedPatient.trimester}</span>
              </div>
              <textarea
                className={styles.notesTextarea}
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                placeholder="Write clinical observations, prescriptions, or follow-up notes..."
                rows={8}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton} onClick={() => setShowNotesModal(false)}>Cancel</button>
              <button className={styles.primaryButton} onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
