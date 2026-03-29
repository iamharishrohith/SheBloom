'use client';
import { useState, useMemo } from 'react';
import { Pill, Plus, X, Clock, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import styles from './prescriptions.module.css';

const DEMO_RX = [
  { id: 1, patient: 'Priya Sharma', drug: 'Ferrous Sulfate', dose: '200mg', freq: '2x/day', timing: 'Morning & Evening', condition: 'Anemia', status: 'active' },
  { id: 2, patient: 'Priya Sharma', drug: 'Folic Acid', dose: '5mg', freq: '1x/day', timing: 'Morning', condition: 'Standard', status: 'active' },
  { id: 3, patient: 'Priya Sharma', drug: 'Calcium Carbonate', dose: '500mg', freq: '1x/day', timing: 'Night (2hrs after iron)', condition: 'Standard', status: 'active' },
  { id: 4, patient: 'Anita Reddy', drug: 'Metformin', dose: '500mg', freq: '2x/day', timing: 'With meals', condition: 'GDM', status: 'active' },
  { id: 5, patient: 'Anita Reddy', drug: 'Insulin (Rapid)', dose: '10 units', freq: '3x/day', timing: 'Pre-meal', condition: 'GDM', status: 'monitoring' },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(DEMO_RX);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [patientFilter, setPatientFilter] = useState('All');
  const [newRx, setNewRx] = useState({ patient: '', drug: '', dose: '', freq: '1x/day', timing: '', condition: '', dietApproval: false });
  const [drugSearch, setDrugSearch] = useState('');

  // Simulating 2000+ maternal drugs database search
  const MATERNAL_DRUGS = [
    'Ferrous Sulfate', 'Folic Acid', 'Calcium Carbonate', 'Metformin', 'Insulin (Rapid)', 
    'Labetalol', 'Methyldopa', 'Nifedipine', 'Ondansetron', 'Promethazine', 'Magnesium Sulfate'
  ];
  
  const suggestedDrugs = MATERNAL_DRUGS.filter(d => 
    drugSearch && d.toLowerCase().includes(drugSearch.toLowerCase())
  );

  const filtered = prescriptions.filter(rx => {
    const matchesSearch = rx.patient.toLowerCase().includes(search.toLowerCase()) || rx.drug.toLowerCase().includes(search.toLowerCase());
    const matchesPatient = patientFilter === 'All' || rx.patient === patientFilter;
    return matchesSearch && matchesPatient;
  });

  const uniquePatients = ['All', ...new Set(prescriptions.map(p => p.patient))];

  const addPrescription = () => {
    setPrescriptions(prev => [...prev, { ...newRx, id: Date.now(), status: 'active', drug: drugSearch || newRx.drug }]);
    setShowModal(false);
    setNewRx({ patient: '', drug: '', dose: '', freq: '1x/day', timing: '', condition: '', dietApproval: false });
    setDrugSearch('');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1><Pill size={28} /> Prescription Manager</h1>
          <p>Manage medications and care routines across all patients</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Prescription
        </button>
      </header>

      <div className={styles.searchBox} style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '0 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(183, 228, 199, 0.5)' }}>
          <Search size={18} color="var(--color-text-muted)" />
          <input style={{ flex: 1, border: 'none', padding: '10px', background: 'transparent', outline: 'none' }} placeholder="Search by patient or medication..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '0 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(183, 228, 199, 0.5)' }}>
          <Filter size={18} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
          <select style={{ border: 'none', background: 'transparent', outline: 'none', padding: '10px 0', cursor: 'pointer', color: 'var(--color-text-secondary)', fontWeight: 'bold' }} value={patientFilter} onChange={e => setPatientFilter(e.target.value)}>
            {uniquePatients.map(p => <option key={p} value={p}>{p === 'All' ? 'All Patients (Global)' : p}</option>)}
          </select>
        </div>
      </div>

      {/* Interaction Warning */}
      <div className={styles.warningBanner}>
        <AlertTriangle size={16} />
        <span>Reminder: Iron and Calcium must be separated by at least 2 hours to prevent absorption interference.</span>
      </div>

      {/* Prescription Cards */}
      <div className={styles.rxGrid}>
        {filtered.map(rx => (
          <div key={rx.id} className={styles.rxCard}>
            <div className={styles.rxHeader}>
              <div className={styles.rxIcon}><Pill size={20} /></div>
              <div>
                <h3>{rx.drug}</h3>
                <span className={styles.rxPatient}>{rx.patient}</span>
              </div>
              <span className={`${styles.statusBadge} ${rx.status === 'active' ? styles.statusActive : styles.statusMonitor}`}>
                {rx.status === 'active' ? <><CheckCircle2 size={12} /> Active</> : <><Clock size={12} /> Monitoring</>}
              </span>
            </div>
            <div className={styles.rxDetails}>
              <div className={styles.rxDetail}><strong>Dose:</strong> {rx.dose}</div>
              <div className={styles.rxDetail}><strong>Frequency:</strong> {rx.freq}</div>
              <div className={styles.rxDetail}><strong>Timing:</strong> {rx.timing}</div>
              <div className={styles.rxDetail}><strong>Condition:</strong> <span className={styles.condTag}>{rx.condition}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Pill size={20} /> New Prescription</h3>
                <span style={{ fontSize: '10px', color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Connected to 2,840+ Maternal Medicines DB</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.field}><label>Patient Name / ID</label><input value={newRx.patient} onChange={e => setNewRx({ ...newRx, patient: e.target.value })} placeholder="e.g. Priya Sharma" /></div>
              
              <div className={styles.fieldRow}>
                <div className={styles.field} style={{ position: 'relative' }}>
                  <label>Drug Name (Search DB)</label>
                  <input value={drugSearch} onChange={e => setDrugSearch(e.target.value)} placeholder="Type to search medicines..." style={{ border: '2px solid var(--color-primary-muted)' }} />
                  {suggestedDrugs.length > 0 && (
                    <div style={{ position: 'absolute', background: 'white', border: '1px solid #ccc', zIndex: 10, width: '100%', maxHeight: '100px', overflowY: 'auto', marginTop: '4px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {suggestedDrugs.map(d => (
                        <div key={d} onClick={() => { setDrugSearch(d); setNewRx({...newRx, drug: d}); }} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>{d}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.field}><label>Dosage</label><input value={newRx.dose} onChange={e => setNewRx({ ...newRx, dose: e.target.value })} placeholder="e.g. 200mg" /></div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Frequency</label>
                  <select value={newRx.freq} onChange={e => setNewRx({ ...newRx, freq: e.target.value })}>
                    <option>1x/day</option><option>2x/day</option><option>3x/day</option><option>As needed</option>
                  </select>
                </div>
                <div className={styles.field}><label>Timing</label><input value={newRx.timing} onChange={e => setNewRx({ ...newRx, timing: e.target.value })} placeholder="e.g. Morning with food" /></div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}><label>Condition</label><input value={newRx.condition} onChange={e => setNewRx({ ...newRx, condition: e.target.value })} placeholder="e.g. Anemia, GDM, Standard" /></div>
                <div className={styles.field} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(82,183,136,0.1)', padding: '10px', borderRadius: '8px' }}>
                    <input type="checkbox" checked={newRx.dietApproval} onChange={e => setNewRx({ ...newRx, dietApproval: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Require Diet-Based Approval</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={addPrescription}>Add Prescription</button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
