// SheBloom — Shared Constants
// Used by both frontend (Next.js) and backend (Elysia)

export const TRUST_LEVELS = {
  doctor: {
    label: 'Doctor Verified',
    icon: 'shield-check',
    color: '#2d6a4f',
    bg: 'rgba(45, 106, 79, 0.12)',
    description: 'Content reviewed and approved by registered medical professionals'
  },
  evidence: {
    label: 'Evidence-Based',
    icon: 'file-check',
    color: '#6a994e',
    bg: 'rgba(106, 153, 78, 0.12)',
    description: 'Based on WHO/ICMR/NHM guidelines with citations'
  },
  community: {
    label: 'Community Wisdom',
    icon: 'users',
    color: '#b5838d',
    bg: 'rgba(181, 131, 141, 0.12)',
    description: 'Traditional practices — discuss with your doctor first'
  }
};

export const CARE_GAPS = {
  knowledge: { label: 'Knowledge Gap', icon: 'book-open', color: 'knowledge', desc: 'Understanding what she needs at each stage' },
  time: { label: 'Time Gap', icon: 'clock', color: 'time', desc: 'Finding moments to care amid busy schedules' },
  action: { label: 'Action Gap', icon: 'hand-helping', color: 'action', desc: 'Knowing exactly what to do right now' },
  nutrition: { label: 'Nutrition Gap', icon: 'salad', color: 'nutrition', desc: 'Addressing deficiencies through food' },
  emotional: { label: 'Emotional Gap', icon: 'heart', color: 'emotional', desc: 'Recognizing and supporting mental health' },
  emergency: { label: 'Emergency Gap', icon: 'siren', color: 'emergency', desc: 'Spotting warning signs before it\'s too late' }
};

export const ROLES = {
  DOCTOR: 'doctor',
  CARETAKER: 'caretaker',
  MATERNAL: 'maternal'
};

export const RELATIONSHIPS = [
  { id: 'husband', label: 'Husband / Partner', icon: 'heart-handshake' },
  { id: 'father', label: 'Father', icon: 'shield' },
  { id: 'mother', label: 'Mother / Mother-in-law', icon: 'flower-2' },
  { id: 'sibling', label: 'Sibling', icon: 'users' },
  { id: 'friend', label: 'Close Friend', icon: 'hand-heart' },
  { id: 'other', label: 'Other Caretaker', icon: 'user-check' }
];

export const SCHEDULES = [
  { id: 'working-9-6', label: 'Working 9-6', icon: 'briefcase', desc: 'Office job with limited daytime access' },
  { id: 'working-shifts', label: 'Shift Work', icon: 'clock', desc: 'Rotating or night shifts' },
  { id: 'working-remote', label: 'Work From Home', icon: 'laptop', desc: 'Remote with flexible breaks' },
  { id: 'homemaker', label: 'Homemaker / Full-time Care', icon: 'home', desc: 'Dedicated full-time to care' },
  { id: 'student', label: 'Student', icon: 'graduation-cap', desc: 'Academic schedule with gaps' },
  { id: 'flexible', label: 'Flexible / Self-employed', icon: 'calendar', desc: 'Can adjust schedule as needed' }
];

export const CONDITIONS = [
  { id: 'none', label: 'No complications', icon: 'check-circle' },
  { id: 'anemia-mild', label: 'Mild Anemia', icon: 'droplet', severity: 'moderate' },
  { id: 'anemia-moderate', label: 'Moderate/Severe Anemia', icon: 'droplets', severity: 'high' },
  { id: 'gestational-diabetes', label: 'Gestational Diabetes (GDM)', icon: 'activity', severity: 'high' },
  { id: 'hypertension', label: 'Hypertension / Pre-eclampsia risk', icon: 'heart-pulse', severity: 'critical' },
  { id: 'thyroid', label: 'Thyroid disorder', icon: 'pill', severity: 'moderate' },
  { id: 'hg', label: 'Hyperemesis (severe vomiting)', icon: 'thermometer', severity: 'moderate' },
  { id: 'previous-loss', label: 'Previous pregnancy loss', icon: 'heart-crack', severity: 'high' }
];

export const DIET_PREFS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: 'leaf' },
  { id: 'non-vegetarian', label: 'Non-Vegetarian', icon: 'beef' },
  { id: 'eggetarian', label: 'Eggetarian', icon: 'egg' },
  { id: 'vegan', label: 'Vegan', icon: 'vegan' }
];

export const REGIONS = [
  { id: 'south-indian', label: 'South Indian' },
  { id: 'north-indian', label: 'North Indian' },
  { id: 'west-indian', label: 'West Indian' },
  { id: 'east-indian', label: 'East Indian' },
  { id: 'general', label: 'Pan-Indian / General' }
];
