'use client';

import { BookOpen, Search, Filter, PlayCircle, FileText, Bookmark } from 'lucide-react';
import VerifyBadge from '@/components/VerifyBadge';
import styles from './learn.module.css';

const MODULES = [
  {
    title: 'Understanding Third Trimester',
    topic: 'Pregnancy Stages',
    type: 'video',
    duration: '12 min',
    saved: true
  },
  {
    title: 'Recognizing Early Labor Signs',
    topic: 'Labor & Delivery',
    type: 'article',
    duration: '5 min read',
    saved: false
  },
  {
    title: 'Dietary Needs for Anemia',
    topic: 'Nutrition',
    type: 'article',
    duration: '8 min read',
    saved: true
  },
  {
    title: 'Postpartum Depression: What to Watch For',
    topic: 'Mental Health',
    type: 'video',
    duration: '15 min',
    saved: false
  }
];

export default function LearnPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <BookOpen size={32} />
        </div>
        <h1>Learning Center</h1>
        <p>Verified medical knowledge, simplified for caretakers</p>
        <VerifyBadge level="doctor" size="md" />
      </header>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input type="text" placeholder="Search topics, symptoms, guides..." />
        <button className={styles.filterBtn}>
          <Filter size={18} />
        </button>
      </div>

      <div className={styles.categories}>
        <span className={`${styles.category} ${styles.activeCategory}`}>All</span>
        <span className={styles.category}>Nutrition</span>
        <span className={styles.category}>Labor</span>
        <span className={styles.category}>Mental Health</span>
      </div>

      <section className={styles.moduleGrid}>
        {MODULES.map((mod, i) => (
          <div key={i} className={styles.moduleCard}>
            <div className={styles.thumbnail}>
              {mod.type === 'video' ? <PlayCircle size={32} color="white" /> : <FileText size={32} color="white" />}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <span className={styles.topic}>{mod.topic}</span>
                <span className={styles.duration}>{mod.duration}</span>
              </div>
              <h3 className={styles.title}>{mod.title}</h3>
              <div className={styles.saveAction}>
                <Bookmark size={18} className={mod.saved ? styles.savedIcon : styles.unsavedIcon} fill={mod.saved ? "currentColor" : "none"} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
