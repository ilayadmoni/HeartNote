'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface UseHeaderReturn {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export function useHeader(): UseHeaderReturn {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLockBodyScroll(isMobileMenuOpen);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return {
    isMobileMenuOpen,
    isScrolled,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
  };
}
