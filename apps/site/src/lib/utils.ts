import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import profile from '@data/profile.json';

type ContactChannel = {
  label: string;
  href: string;
  todo?: string;
};

type HighlightStat = {
  title: string;
  description: string;
};

type InnovationTheme = {
  title: string;
  context: string;
  todo?: string;
};

type ValueCard = {
  title: string;
  description: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const linkedinLink = profile.links.linkedin;

export const contactChannels: ContactChannel[] = [
  linkedinLink.startsWith('TODO')
    ? { label: 'LinkedIn', href: '#', todo: 'Add LinkedIn URL' }
    : { label: 'LinkedIn', href: linkedinLink },
  { label: 'Email', href: profile.links.email }
];

export const stats: HighlightStat[] = profile.current_role.focus.map((focus) => ({
  title: focus,
  description: 'Current focus area'
}));

export const innovationThemes: InnovationTheme[] = profile.innovation_themes.map((theme) => ({
  title: theme,
  context: 'Ongoing invention theme centered on SIEM resilience.',
  todo: 'TODO: Provide patent application numbers if filed.'
}));

export const experienceHighlights: string[] = [
  'Drove modernization of SIEM rules engines to improve agility and manageability.',
  'Advanced real-time operational visibility and high-availability posture across cybersecurity platforms.',
  'Led cross-functional engineering initiatives supporting a dual-SIEM posture and enrichment at scale.',
  'Focused on uptime and latency reduction that supports Cyber Fusion Center workflows.'
];

export const values: ValueCard[] = [
  {
    title: 'Platform mindset',
    description: 'Treating SIEM capabilities as products keeps teams aligned on user outcomes and resilience.'
  },
  {
    title: 'Operational visibility',
    description: 'Reliable telemetry and instrumentation create the confidence to act quickly and safely.'
  },
  {
    title: 'Collaborative leadership',
    description: 'Cross-functional alignment and clear objectives unlock scalable cybersecurity engineering.'
  }
];
