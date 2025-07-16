'use client';

import { useEffect, useState } from 'react';
import MobileOptimizedWizard from './MobileOptimizedWizard';
import DesktopBusinessWizard from './DesktopBusinessWizard';

interface EnhancedBusinessWizardProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Acts as a thin wrapper that decides which wizard (mobile vs. desktop)
 * should be shown. All real logic now lives inside the specific wizard
 * components. This keeps the file tiny and prevents duplicate business-logic.
 */
export default function EnhancedBusinessWizard({ open, onClose }: EnhancedBusinessWizardProps) {
  // `true` if viewport < 768px
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update(); // initial check

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!open) return null;

  return isMobile ? (
    <MobileOptimizedWizard open={open} onClose={onClose} />
  ) : (
    <DesktopBusinessWizard open={open} onClose={onClose} />
  );
} 