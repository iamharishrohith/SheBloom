'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Wifi, Pill, BarChart3, Brain,
  Settings, UserPlus, Stethoscope, Menu, X,
  BrainCircuit, Inbox
} from 'lucide-react';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { label: 'Overview', section: 'DASHBOARD', href: '/overview', icon: LayoutDashboard },
  { label: 'Patients', section: 'DASHBOARD', href: '/patients', icon: Users },
  { label: 'AI Approvals', section: 'APPROVALS', href: '/ai-approvals', icon: BrainCircuit, badge: '2' },
  { label: 'General Requests', section: 'APPROVALS', href: '/general-requests', icon: Inbox },
  { label: 'Environment', section: 'CLINICAL', href: '/environment', icon: Wifi, badge: 'LIVE' },
  { label: 'Prescriptions', section: 'CLINICAL', href: '/prescriptions', icon: Pill },
  { label: 'Analytics', section: 'INSIGHTS', href: '/analytics', icon: BarChart3 },
  { label: 'PPD Monitor', section: 'INSIGHTS', href: '/ppd-monitor', icon: Brain },
  { label: 'Onboard Patient', section: 'ACTIONS', href: '/onboarding', icon: UserPlus },
  { label: 'Settings', section: 'ACTIONS', href: '/settings', icon: Settings },
];

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [...new Set(NAV_ITEMS.map(i => i.section))];

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandLogo}>
            <Stethoscope size={22} />
          </div>
          <div className={styles.brandText}>
            <h2>SheBloom</h2>
            <span>Clinical Hub</span>
          </div>
        </div>

        <nav className={styles.navSection}>
          {sections.map(section => (
            <div key={section}>
              <div className={styles.navLabel}>{section}</div>
              {NAV_ITEMS.filter(i => i.section === section).map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    {item.label}
                    {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.deviceStatus}>
            <span className={styles.liveDot}></span>
            IoT Devices Connected
          </div>
          <div className={styles.doctorProfile}>
            <div className={styles.doctorAvatar}>SJ</div>
            <div className={styles.doctorInfo}>
              <strong>Dr. Sarah Jenkins</strong>
              <span>Maternal Care</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Mobile menu toggle */}
      <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}
