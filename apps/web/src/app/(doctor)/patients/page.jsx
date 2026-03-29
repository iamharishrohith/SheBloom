'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Users, AlertTriangle, CheckCircle2, ArrowRight, Baby, ChevronDown } from 'lucide-react';
import styles from './patients.module.css';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    fetch('http://localhost:4000/api/doctor/patients')
      .then(res => res.json())
      .then(data => { setPatients(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = patients
    .filter(p => {
      if (search && !p.maternalName?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterRisk === 'critical' && p.complianceRate >= 50) return false;
      if (filterRisk === 'low' && p.ppdRiskLevel !== 'low') return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.maternalName?.localeCompare(b.maternalName);
      if (sortBy === 'compliance') return a.complianceRate - b.complianceRate;
      if (sortBy === 'trimester') return a.trimester - b.trimester;
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

  if (loading) return <div className={styles.loading}>Loading patient registry...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1><Users size={28} /> Patient Registry</h1>
          <p>{patients.length} active care circle{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => window.location.href = '/onboarding'}>+ New Patient</button>
      </header>

      {/* Search & Filters */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.select}>
            <option value="name">Sort: Name</option>
            <option value="compliance">Sort: Compliance</option>
            <option value="trimester">Sort: Trimester</option>
            <option value="dueDate">Sort: Due Date</option>
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className={styles.select}>
            <option value="all">All Patients</option>
            <option value="critical">Critical Only</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Patient</span>
          <span>Trimester</span>
          <span>Conditions</span>
          <span>Compliance</span>
          <span>PPD Risk</span>
          <span>Due Date</span>
          <span></span>
        </div>
        {filtered.length === 0 && (
          <div className={styles.emptyRow}>
            <Baby size={32} />
            <p>No patients match your search criteria.</p>
          </div>
        )}
        {filtered.map(p => {
          const isCritical = p.complianceRate < 50;
          return (
            <div key={p.id} className={styles.tableRow}>
              <span className={styles.patientName}>
                <div className={styles.avatar}>{p.maternalName?.charAt(0)}</div>
                <div>
                  <strong>{p.maternalName}</strong>
                  <small>{p.phone}</small>
                </div>
              </span>
              <span className={styles.trimBadge}>T{p.trimester}</span>
              <span className={styles.conditionsCell}>
                {p.conditions?.length > 0
                  ? p.conditions.map(c => <span key={c} className={styles.condTag}>{c}</span>)
                  : <span className={styles.noConditions}>None</span>
                }
              </span>
              <span className={styles.compCell}>
                <div className={styles.compBar}>
                  <div className={styles.compFill} style={{ width: `${p.complianceRate}%`, background: isCritical ? 'var(--color-danger)' : 'var(--color-primary)' }} />
                </div>
                <span style={{ color: isCritical ? 'var(--color-danger)' : 'var(--color-primary)', fontWeight: 600 }}>{p.complianceRate}%</span>
              </span>
              <span>
                <span className={`${styles.riskTag} ${p.ppdRiskLevel === 'low' ? styles.riskLow : styles.riskHigh}`}>
                  {p.ppdRiskLevel?.toUpperCase()}
                </span>
              </span>
              <span className={styles.dateCell}>{new Date(p.dueDate).toLocaleDateString()}</span>
              <span>
                <button className={styles.viewBtn} onClick={() => window.location.href = `/patients/${p.id}`}>
                  <ArrowRight size={16} />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
