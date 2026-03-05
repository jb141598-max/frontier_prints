'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label: string;
  fallbackHref: string;
  className?: string;
}

export function BackButton({ label, fallbackHref, className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className || 'btn-secondary'}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      {label}
    </button>
  );
}
