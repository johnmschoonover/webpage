import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';

interface ReadingProgressProps {
  target?: string;
  className?: string;
}

export function ReadingProgress({ target = 'article', className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const el = document.querySelector<HTMLElement>(target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const start = rect.top + scrollTop;
      const height = el.offsetHeight;
      const end = start + height - window.innerHeight;
      if (height <= window.innerHeight) {
        setProgress(100);
        return;
      }
      const percent = Math.min(Math.max(((scrollTop - start) / (end - start)) * 100, 0), 100);
      setProgress(percent);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return (
    <div className={cn('fixed inset-x-0 top-0 z-50 h-1 bg-transparent', className)} aria-hidden>
      <div
        className="h-full origin-left bg-primary transition-[width] duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
