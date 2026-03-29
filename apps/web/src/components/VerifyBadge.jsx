'use client';

import { ShieldCheck, FileCheck, Users } from 'lucide-react';

const BADGES = {
  doctor: { label: 'Doctor Verified', Icon: ShieldCheck, color: '#2d6a4f', bg: 'rgba(45, 106, 79, 0.12)' },
  evidence: { label: 'Evidence-Based', Icon: FileCheck, color: '#6a994e', bg: 'rgba(106, 153, 78, 0.12)' },
  community: { label: 'Community Wisdom', Icon: Users, color: '#b5838d', bg: 'rgba(181, 131, 141, 0.12)' }
};

export default function VerifyBadge({ level = 'evidence', size = 'sm', citation }) {
  const badge = BADGES[level] || BADGES.evidence;
  const { Icon } = badge;

  const sizeStyles = size === 'lg'
    ? { padding: '4px 10px', fontSize: '0.72rem', gap: '4px' }
    : { padding: '2px 8px', fontSize: '0.65rem', gap: '3px' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...sizeStyles,
        borderRadius: '999px',
        background: badge.bg,
        color: badge.color,
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        verticalAlign: 'middle'
      }}
      title={citation || badge.label}
    >
      <Icon size={size === 'lg' ? 12 : 10} />
      {badge.label}
    </span>
  );
}
