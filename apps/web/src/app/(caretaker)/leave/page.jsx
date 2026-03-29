'use client';
import { useState } from 'react';
import { FileText, Copy, CheckCircle2, Download, Calendar, Building, User, Briefcase } from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import styles from './leave.module.css';

const TEMPLATES = [
  { id: 'prenatal', label: 'Prenatal Checkup Leave', desc: 'For accompanying to scheduled doctor visits', icon: Calendar },
  { id: 'emergency', label: 'Emergency Medical Leave', desc: 'For pregnancy-related emergencies', icon: FileText },
  { id: 'caretaker', label: 'Caretaker Support Leave', desc: 'General care duties during pregnancy', icon: User },
  { id: 'postpartum', label: 'Postpartum Care Leave', desc: 'Paternity/caretaker leave after delivery', icon: Briefcase },
];

function generateLetter(type, details) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const templates = {
    prenatal: `To,
The Manager / HR Department,
${details.company || '[Company Name]'},
${details.city || '[City]'}

Date: ${today}

Subject: Leave Application for Prenatal Medical Accompaniment

Respected Sir/Madam,

I am writing to formally request leave on ${details.date || '[Date]'} to accompany my ${details.relation || 'wife'}, ${details.herName || '[Her Name]'}, who is currently ${details.weeks || '[X]'} weeks pregnant, for a scheduled prenatal checkup at ${details.hospital || '[Hospital Name]'}.

As per the Maternity Benefit Act, 1961 (Amendment 2017), partners and caretakers are recognized as essential support during the pregnancy journey. Medical guidelines from WHO and ACOG recommend that a support person be present at all prenatal visits to ensure comprehensive care understanding.

I shall resume my duties on ${details.returnDate || '[Return Date]'} and will ensure all pending work is managed accordingly.

Thank you for your understanding and support.

Yours sincerely,
${details.name || '[Your Name]'}
Employee ID: ${details.empId || '[Employee ID]'}
Department: ${details.dept || '[Department]'}`,

    emergency: `To,
The Manager / HR Department,
${details.company || '[Company Name]'}

Date: ${today}

Subject: Urgent Leave Application — Pregnancy Emergency

Respected Sir/Madam,

I am writing to request emergency leave from ${details.date || '[Start Date]'} to ${details.returnDate || '[End Date]'} due to a medical emergency involving my ${details.relation || 'wife'}, ${details.herName || '[Her Name]'}, who is currently pregnant.

The situation requires my immediate presence as the primary caretaker. I will provide medical documentation upon my return.

I kindly request your urgent approval.

Yours sincerely,
${details.name || '[Your Name]'}
Employee ID: ${details.empId || '[Employee ID]'}`,

    caretaker: `To,
The Manager / HR Department,
${details.company || '[Company Name]'}

Date: ${today}

Subject: Leave Application for Maternal Care Duties

Respected Sir/Madam,

I wish to apply for leave on ${details.date || '[Date]'} to attend to the care needs of my ${details.relation || 'wife'}, ${details.herName || '[Her Name]'}, who is in the ${details.trimester || 'second'} trimester of pregnancy.

As her primary caretaker, I need to ensure her well-being, manage prescribed care routines, and support her physical and emotional health as recommended by her healthcare provider.

I shall ensure minimal disruption to work responsibilities and will be reachable for urgent matters.

Yours sincerely,
${details.name || '[Your Name]'}
Employee ID: ${details.empId || '[Employee ID]'}`,

    postpartum: `To,
The Manager / HR Department,
${details.company || '[Company Name]'}

Date: ${today}

Subject: Application for Paternity / Caretaker Leave

Respected Sir/Madam,

I am pleased to inform you that my ${details.relation || 'wife'}, ${details.herName || '[Her Name]'}, has delivered on ${details.date || '[Delivery Date]'}. I wish to apply for paternity/caretaker leave from ${details.date || '[Start Date]'} to ${details.returnDate || '[End Date]'}.

As per the Central Civil Services (Leave) Rules and best practices adopted by leading organizations, paternity leave is essential for newborn bonding, maternal recovery support, and family well-being during the critical postpartum period.

I shall resume duties on ${details.returnDate || '[Return Date]'} and will ensure a smooth handover of responsibilities.

Yours sincerely,
${details.name || '[Your Name]'}
Employee ID: ${details.empId || '[Employee ID]'}`,
  };
  return templates[type] || templates.prenatal;
}

export default function LeavePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('prenatal');
  const [details, setDetails] = useState({
    name: 'Rohith', herName: 'Priya', relation: 'wife',
    company: '', city: '', hospital: '', empId: '',
    dept: '', date: '', returnDate: '', weeks: '20', trimester: 'second'
  });
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerated(generateLetter(selectedTemplate, details));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerIcon}><FileText size={32} /></div>
        <h1>Leave Generator</h1>
        <p>Auto-generate professionally formatted leave applications</p>
        <VerifyBadge level="evidence" size="md" citation="Maternity Benefit Act 1961 (Amendment 2017)" />
      </header>

      {/* Template Selection */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Template</h2>
        <div className={styles.templateGrid}>
          {TEMPLATES.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`${styles.templateCard} ${selectedTemplate === t.id ? styles.templateActive : ''}`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <Icon size={24} />
                <strong>{t.label}</strong>
                <span>{t.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Details Form */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Fill Details</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}><label>Your Name</label><input value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} /></div>
          <div className={styles.field}><label>Her Name</label><input value={details.herName} onChange={e => setDetails({ ...details, herName: e.target.value })} /></div>
          <div className={styles.field}><label>Company Name</label><input value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })} placeholder="e.g. Infosys Limited" /></div>
          <div className={styles.field}><label>City</label><input value={details.city} onChange={e => setDetails({ ...details, city: e.target.value })} placeholder="e.g. Bangalore" /></div>
          <div className={styles.field}><label>Employee ID</label><input value={details.empId} onChange={e => setDetails({ ...details, empId: e.target.value })} /></div>
          <div className={styles.field}><label>Department</label><input value={details.dept} onChange={e => setDetails({ ...details, dept: e.target.value })} /></div>
          <div className={styles.field}><label>Leave Date</label><input type="date" value={details.date} onChange={e => setDetails({ ...details, date: e.target.value })} /></div>
          <div className={styles.field}><label>Return Date</label><input type="date" value={details.returnDate} onChange={e => setDetails({ ...details, returnDate: e.target.value })} /></div>
          {selectedTemplate === 'prenatal' && (
            <div className={styles.field}><label>Hospital</label><input value={details.hospital} onChange={e => setDetails({ ...details, hospital: e.target.value })} placeholder="e.g. City Maternity Hospital" /></div>
          )}
        </div>
        <button className={styles.generateBtn} onClick={handleGenerate}>
          <FileText size={18} /> Generate Letter
        </button>
      </section>

      {/* Generated Output */}
      {generated && (
        <section className={styles.section}>
          <div className={styles.outputHeader}>
            <h2 className={styles.sectionTitle}>Generated Letter</h2>
            <div className={styles.outputActions}>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
          </div>
          <pre className={styles.output}>{generated}</pre>
        </section>
      )}
    </div>
  );
}
