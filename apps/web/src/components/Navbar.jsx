'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Sprout, Home, BookOpen, UtensilsCrossed, CalendarClock,
  HeartPulse, AlertTriangle, Sparkles, FileText, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home', Icon: Home },
  { href: '/learn', label: 'Learn', Icon: BookOpen },
  { href: '/meals', label: 'Meals', Icon: UtensilsCrossed },
  { href: '/timeline', label: 'Care Plan', Icon: CalendarClock },
  { href: '/selfcare', label: 'You', Icon: Sparkles },
  { href: '/leave', label: 'Leave', Icon: FileText },
  { href: '/emergency', label: 'Emergency', Icon: AlertTriangle },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-content">
        <a className="nav-brand" href="/dashboard" onClick={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
          <div className="brand-icon"><Sprout size={18} /></div>
          <span className="brand-name">SheBloom</span>
          <span className="brand-sub">companion guide</span>
        </a>

        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <button
                key={href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => { router.push(href); setMobileOpen(false); }}
              >
                <Icon size={16} className="nav-icon" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
