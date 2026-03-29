'use client';
import React, { useState } from 'react';
import { Stethoscope, UserPlus, Phone, Calendar, HeartPulse, Send, CheckCircle, Baby, User } from 'lucide-react';
import styles from './onboarding.module.css';
import VerifyBadge from '@/components/VerifyBadge';

export default function DoctorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    maternalName: '',
    maternalPhone: '',
    maternalDob: '',
    maternalAge: '',
    maternalBloodGroup: '',
    caretakerName: '',
    caretakerPhone: '',
    caretakerDob: '',
    caretakerAge: '',
    relationship: 'Husband / Partner',
    schedule: '9to6',
    dueDate: '',
    trimester: 2,
    weekNumber: 20,
    conditions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Auto-calculate age from DOB
    if (name === 'maternalDob' && value) {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      updated.maternalAge = age > 0 ? String(age) : '';
    }
    if (name === 'caretakerDob' && value) {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      updated.caretakerAge = age > 0 ? String(age) : '';
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      maternal: { 
        name: formData.maternalName, 
        phone: formData.maternalPhone,
        dob: formData.maternalDob,
        age: parseInt(formData.maternalAge) || null,
        bloodGroup: formData.maternalBloodGroup
      },
      caretaker: { 
        name: formData.caretakerName, 
        phone: formData.caretakerPhone,
        dob: formData.caretakerDob,
        age: parseInt(formData.caretakerAge) || null,
        relationship: formData.relationship, 
        schedule: formData.schedule 
      },
      clinicalParams: {
        dueDate: formData.dueDate,
        trimester: parseInt(formData.trimester, 10),
        weekNumber: parseInt(formData.weekNumber, 10),
        conditions: formData.conditions.split(',').map(c => c.trim()).filter(Boolean)
      }
    };

    try {
      const response = await fetch('http://localhost:4000/api/doctor/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Failed to provision Care Circle.');
      }
    } catch (err) {
      console.error(err);
      alert('Error contacting server.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <CheckCircle className={styles.successIcon} size={64} />
        <h1>Care Circle Activated!</h1>
        <p>A secure login link has been sent to <strong>{formData.caretakerName}</strong> via SMS/WhatsApp.</p>
        <p>The Evidence-Based Care Timeline has been seeded with {formData.conditions ? 'targeted prescriptions' : 'standard maternal care'} for Trimester {formData.trimester}.</p>
        <button className={styles.primaryButton} onClick={() => window.location.reload()}>Onboard Next Patient</button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}><Stethoscope size={24} /></div>
          <h2>SheBloom <span>Clinical Hub</span></h2>
        </div>
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ''}`}>1</div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ''}`}>2</div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.onboardingCard}>
          <div className={styles.cardHeader}>
            <h3>{step === 1 ? 'Patient & Caretaker Details' : 'Clinical Parameters'}</h3>
            <p>{step === 1 ? 'Register the maternal person and their primary caretaker.' : 'Configure pregnancy timeline and medical conditions.'}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {step === 1 && (
              <div className={styles.formSection}>
                <h4><Baby size={18} /> Maternal Person Details</h4>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input required name="maternalName" value={formData.maternalName} onChange={handleChange} placeholder="e.g. Priya Sharma" />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Date of Birth</label>
                    <input required type="date" name="maternalDob" value={formData.maternalDob} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Age (Auto)</label>
                    <input type="number" name="maternalAge" value={formData.maternalAge} onChange={handleChange} placeholder="Auto-calculated" readOnly />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input required type="tel" name="maternalPhone" value={formData.maternalPhone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Blood Group</label>
                    <select name="maternalBloodGroup" value={formData.maternalBloodGroup} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                
                <h4 className={styles.marginTop}><User size={18} /> Primary Caretaker Details</h4>
                <p className={styles.helperText}>This person will receive the App login and daily task timeline.</p>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input required name="caretakerName" value={formData.caretakerName} onChange={handleChange} placeholder="e.g. Rahul Sharma" />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Date of Birth</label>
                    <input type="date" name="caretakerDob" value={formData.caretakerDob} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Age (Auto)</label>
                    <input type="number" name="caretakerAge" value={formData.caretakerAge} onChange={handleChange} placeholder="Auto-calculated" readOnly />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input required type="tel" name="caretakerPhone" value={formData.caretakerPhone} onChange={handleChange} placeholder="+91 91234 56789" />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Relationship</label>
                    <select name="relationship" value={formData.relationship} onChange={handleChange}>
                      <option value="Husband / Partner">Husband / Partner</option>
                      <option value="Mother">Mother</option>
                      <option value="Mother-in-law">Mother-in-law</option>
                      <option value="Sister">Sister</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Work Schedule</label>
                    <select name="schedule" value={formData.schedule} onChange={handleChange}>
                      <option value="9to6">Standard 9-6 Job</option>
                      <option value="flexible">Flexible / Work from Home</option>
                      <option value="shift">Shift Worker</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.actions}>
                  <button type="button" className={styles.primaryButton} onClick={() => setStep(2)}>Next: Clinical Data →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formSection}>
                <h4><Calendar size={18} /> Pregnancy Timeline</h4>
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Expected Due Date (EDD)</label>
                    <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Trimester</label>
                    <select name="trimester" value={formData.trimester} onChange={handleChange}>
                      <option value="1">First Trimester (1-13 weeks)</option>
                      <option value="2">Second Trimester (14-27 weeks)</option>
                      <option value="3">Third Trimester (28-40 weeks)</option>
                    </select>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Current Week Number</label>
                  <input type="number" name="weekNumber" value={formData.weekNumber} onChange={handleChange} min="1" max="42" />
                </div>

                <h4 className={styles.marginTop}><HeartPulse size={18} /> Clinical Conditions & Rx</h4>
                <p className={styles.helperText}>These conditions will automatically generate evidence-based care tasks in the Caretaker's App.</p>
                
                <div className={styles.inputGroup}>
                  <label>Detected Conditions (Comma separated)</label>
                  <input 
                    name="conditions" 
                    value={formData.conditions} 
                    onChange={handleChange} 
                    placeholder="e.g. Gestational Diabetes, Anemia" 
                  />
                </div>

                <div className={styles.badgeContainer}>
                  <VerifyBadge level="doctor" />
                  <span>Timeline tasks generated from these inputs will be marked strictly as Doctor Verified.</span>
                </div>
                
                <div className={styles.actions}>
                  <button type="button" className={styles.secondaryButton} onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? 'Provisioning...' : <><Send size={18}/> Provision Care Circle</>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
