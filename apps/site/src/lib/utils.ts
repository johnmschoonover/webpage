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

export const experienceHighlights: string[] = [
  'Lead a multidisciplinary engineering team delivering the core security telemetry platform end to end.',
  'Architect scalable patterns that adapt to evolving threats while aligning detection, response, and risk objectives.',
  'Partner with incident response, detection engineering, and threat intel to integrate workflows and reduce triage effort.',
  'Mentor engineers to scale ownership, eliminate single points of failure, and sustain high-performing teams.'
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
