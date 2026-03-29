'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, ShieldCheck, Heart, Clock, Baby, 
  ArrowRight, Stethoscope, Users, FileCheck,
  HeartHandshake, Activity, BookOpen, Download,
  Smartphone
} from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className={styles.landing}>
      {/* ---- Hero Section ---- */}
      <header className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <nav className={styles.heroNav}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <Sprout size={20} />
            </div>
            <span className={styles.brandName}>SheBloom</span>
            <span className={styles.brandSub}>companion guide</span>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.loginBtn} onClick={() => router.push('/dashboard')}>
              Caretaker
            </button>
            <button className={styles.loginBtn} onClick={() => router.push('/overview')}>
              Doctor
            </button>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.trustPill}>
            <ShieldCheck size={14} />
            <span>Doctor Verified Maternal Care</span>
          </div>
          <h1 className={styles.heroTitle}>
            Caring for her<br />
            <span className={styles.heroAccent}>doesn't have to be overwhelming</span>
          </h1>
          <p className={styles.heroSubtitle}>
            SheBloom bridges the gap between doctors, caretakers, and the maternal person — 
            so every pill is tracked, every meal is planned, and every concern reaches the right person.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => router.push('/dashboard')}>
              <HeartHandshake size={18} />
              Start as Caretaker
            </button>
            <button className={styles.secondaryCta} onClick={() => router.push('/overview')}>
              <Stethoscope size={18} />
              Join as Doctor
            </button>
          </div>
        </div>
      </header>

      {/* ---- The Care Circle ---- */}
      <section className={styles.circleSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>The Care Circle</span>
          <h2 className={styles.sectionTitle}>Three roles, one mission</h2>
          <p className={styles.sectionDesc}>
            SheBloom brings doctors, caretakers, and the maternal person into a connected care circle — 
            each role empowered, no one overwhelmed.
          </p>
        </div>

        <div className={styles.circleGrid}>
          <div 
            className={`${styles.circleCard} ${activeRole === 'doctor' ? styles.active : ''}`}
            onMouseEnter={() => setActiveRole('doctor')}
            onMouseLeave={() => setActiveRole(null)}
          >
            <div className={styles.circleIcon} style={{ background: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary)' }}>
              <Stethoscope size={28} />
            </div>
            <h3>Doctor</h3>
            <p className={styles.circleRole}>Primary User</p>
            <ul className={styles.circleFeatures}>
              <li><ShieldCheck size={14} /> Verify care content</li>
              <li><Activity size={14} /> Remote compliance tracking</li>
              <li><FileCheck size={14} /> Auto-generated patient reports</li>
              <li><Clock size={14} /> Async symptom reviews</li>
            </ul>
            <p className={styles.circleImpact}>Reduces clinic overload by 40% through between-visit monitoring</p>
          </div>

          <div 
            className={`${styles.circleCard} ${activeRole === 'caretaker' ? styles.active : ''}`}
            onMouseEnter={() => setActiveRole('caretaker')}
            onMouseLeave={() => setActiveRole(null)}
          >
            <div className={styles.circleIcon} style={{ background: 'rgba(106, 153, 78, 0.1)', color: '#6a994e' }}>
              <HeartHandshake size={28} />
            </div>
            <h3>Caretaker</h3>
            <p className={styles.circleRole}>Primary User</p>
            <ul className={styles.circleFeatures}>
              <li><Clock size={14} /> Time-based care tasks</li>
              <li><BookOpen size={14} /> Doctor-approved actions</li>
              <li><FileCheck size={14} /> Auto leave applications</li>
              <li><Heart size={14} /> Emotional self-care</li>
            </ul>
            <p className={styles.circleImpact}>Never miss a supplement, a meal, or a moment of care</p>
          </div>

          <div 
            className={`${styles.circleCard} ${styles.beneficiary} ${activeRole === 'maternal' ? styles.active : ''}`}
            onMouseEnter={() => setActiveRole('maternal')}
            onMouseLeave={() => setActiveRole(null)}
          >
            <div className={styles.circleIcon} style={{ background: 'rgba(244, 132, 95, 0.1)', color: 'var(--color-accent)' }}>
              <Baby size={28} />
            </div>
            <h3>Maternal Person</h3>
            <p className={styles.circleRole}>Beneficiary</p>
            <ul className={styles.circleFeatures}>
              <li><Heart size={14} /> Organic care that flows around her</li>
              <li><ShieldCheck size={14} /> All advice is medically verified</li>
              <li><Users size={14} /> She doesn't need to use the app</li>
              <li><Sprout size={14} /> Just receives the love</li>
            </ul>
            <p className={styles.circleImpact}>Technology works invisibly — she just feels loved and cared for</p>
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Doctor Verified</span>
          <h2 className={styles.sectionTitle}>Every piece of advice you can trust</h2>
        </div>

        <div className={styles.featureGrid}>
          {[
            { icon: <ShieldCheck size={24} />, title: 'Doctor Verified', desc: 'All care suggestions are reviewed by registered medical professionals with WHO/ICMR citations.', color: '#2d6a4f' },
            { icon: <Clock size={24} />, title: 'Smart Care Timeline', desc: 'Personalized daily schedule that adapts to the caretaker\'s work routine — no one-size-fits-all.', color: '#6a994e' },
            { icon: <Heart size={24} />, title: 'PPD Screening', desc: 'Edinburgh Postnatal Depression Scale — detect postpartum depression early and save lives.', color: '#b5838d' },
            { icon: <FileCheck size={24} />, title: 'Leave Automation', desc: 'Auto-generate leave applications compliant with the Maternity Benefit Act — for both mother and caretaker.', color: '#e9c46a' },
            { icon: <Activity size={24} />, title: 'Recovery Tracking', desc: '52-week postpartum recovery journey from healing to thriving — the phase healthcare forgot.', color: '#e07a5f' },
            { icon: <BookOpen size={24} />, title: 'Tamil Native Support', desc: 'Medical glossary in Tamil — bridging the language gap between doctors and families.', color: '#2a9d8f' }
          ].map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color: feature.color, background: `${feature.color}14` }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to give her the care she deserves?</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className={styles.primaryCta} onClick={() => router.push('/dashboard')}>
              <HeartHandshake size={18} />
              Start as Caretaker
              <ArrowRight size={16} />
            </button>
            <button className={styles.secondaryCta} onClick={() => router.push('/overview')} style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
              <Stethoscope size={18} />
              Join as Doctor
            </button>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Sprout size={16} /></div>
            <span className={styles.brandName}>SheBloom</span>
          </div>
          <p>Doctor Verified Maternal Care Companion</p>
          <p className={styles.footerNote}>All medical advice is based on WHO, ICMR, ACOG, and NHM guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
