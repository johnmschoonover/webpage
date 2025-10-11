import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const contactChannels = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/johnmschoonover/' },
  { label: 'Email', href: 'mailto:hello@theschoonover.net' },
  { label: 'GitHub', href: 'https://github.com/johnschoonover' }
];

export const stats = [
  { label: 'Platforms scaled', value: '4 global security fabrics' },
  { label: 'Ingestion volume', value: '85B+ events/day' },
  { label: 'Org leadership', value: '120+ engineers, analysts, data ops' },
  { label: 'Patent activity', value: '2 filed / 3 in-flight' }
];

export const patents = [
  { title: 'Parse Failure Fingerprinting for Intelligent Drop Control', status: 'Filed', year: 2025 },
  { title: 'UID-Based Drop Control in High-Throughput Pipelines', status: 'Draft', year: 2025 }
];

export const resumeHighlights = [
  {
    role: 'Director, Cybersecurity Engineering',
    org: 'Major Cloud Provider',
    time: '2021 — Present',
    achievements: [
      'Scaled dual-SIEM architecture covering 200+ log sources with zero downtime.',
      'Delivered executive-ready command dashboards with <60s latency.',
      'Stood up patent program resulting in five disclosures and two filings.'
    ]
  },
  {
    role: 'Head of Security Data Platform',
    org: 'Global Financial Services Firm',
    time: '2018 — 2021',
    achievements: [
      'Built cloud-native ingestion platform with 15 regional collectors.',
      'Reduced MTTR by 40% by aligning automation squads around golden signals.',
      'Implemented risk-adjusted backlog process to prioritize remediation.'
    ]
  }
];

export const values = [
  {
    title: 'Design for reliability',
    description: 'Systems earn trust when telemetry, automation, and process reinforce each other.'
  },
  {
    title: 'Lead with clarity',
    description: 'People move faster when purpose, constraints, and outcomes are explicit.'
  },
  {
    title: 'Measure what matters',
    description: 'Objective metrics make storytelling honest and keep programs funded.'
  }
];
