'use client';
import { useState } from 'react';
import { Settings, User, Bell, Wifi, Shield, Save, CheckCircle2 } from 'lucide-react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    specialization: 'Obstetrics & Gynecology',
    clinic: 'City Maternity Hospital',
    phone: '+91 98765 43210',
    email: 'dr.sarah@shebloom.care',
  });
  const [alerts, setAlerts] = useState({
    complianceDrop: true,
    airQuality: true,
    ppdSpike: true,
    missedMeds: true,
    threshold: 300,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1><Settings size={28} /> Settings</h1>
        <p>Configure your profile, alerts, and IoT preferences</p>
      </header>

      {/* Save Toast */}
      {saved && (
        <div className={styles.toast}>
          <CheckCircle2 size={18} /> Settings saved successfully
        </div>
      )}

      <div className={styles.sections}>
        {/* Profile */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}><User size={20} /> <h3>Doctor Profile</h3></div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Specialization</label>
              <input value={profile.specialization} onChange={e => setProfile({ ...profile, specialization: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Clinic / Hospital</label>
              <input value={profile.clinic} onChange={e => setProfile({ ...profile, clinic: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}><Bell size={20} /> <h3>Alert Preferences</h3></div>
          <div className={styles.toggleList}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={alerts.complianceDrop} onChange={e => setAlerts({ ...alerts, complianceDrop: e.target.checked })} />
              <div className={styles.toggleSwitch}></div>
              <div><strong>Compliance Drop</strong><span>Alert when patient compliance falls below 50%</span></div>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={alerts.airQuality} onChange={e => setAlerts({ ...alerts, airQuality: e.target.checked })} />
              <div className={styles.toggleSwitch}></div>
              <div><strong>Air Quality Alerts</strong><span>Alert when room air quality exceeds threshold</span></div>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={alerts.ppdSpike} onChange={e => setAlerts({ ...alerts, ppdSpike: e.target.checked })} />
              <div className={styles.toggleSwitch}></div>
              <div><strong>PPD Score Spike</strong><span>Alert when Edinburgh score increases by 3+ points</span></div>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={alerts.missedMeds} onChange={e => setAlerts({ ...alerts, missedMeds: e.target.checked })} />
              <div className={styles.toggleSwitch}></div>
              <div><strong>Missed Medications</strong><span>Alert when critical medications are not logged</span></div>
            </label>
          </div>
        </div>

        {/* IoT Configuration */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}><Wifi size={20} /> <h3>IoT Configuration</h3></div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Air Quality Alert Threshold (PPM)</label>
              <input type="number" value={alerts.threshold} onChange={e => setAlerts({ ...alerts, threshold: parseInt(e.target.value) })} />
              <span className={styles.fieldHint}>Default: 300 PPM. Alerts trigger when indoor air quality exceeds this value.</span>
            </div>
            <div className={styles.field}>
              <label>Connected Devices</label>
              <div className={styles.deviceCard}>
                <Wifi size={18} />
                <div>
                  <strong>shebloom-node-01</strong>
                  <span>ESP32 • DHT22 + MQ-135 + OLED</span>
                </div>
                <span className={styles.onlineBadge}>● Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}><Shield size={20} /> <h3>Security</h3></div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Doctor ID</label>
              <input value="1" readOnly className={styles.readOnly} />
              <span className={styles.fieldHint}>Auto-assigned. Used for care circle provisioning.</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.saveRow}>
        <button className={styles.saveBtn} onClick={handleSave}>
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}
