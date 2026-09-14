'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return {
    isDark,
    textColor: isDark ? '#F8FAFC' : '#0F172A',
    secondaryTextColor: isDark ? '#94A3B8' : '#64748B',
    gridColor: isDark ? '#334155' : '#E2E8F0',
    tooltipBg: isDark ? '#111827' : '#FFFFFF',
    tooltipBorder: isDark ? '#334155' : '#E2E8F0',
    tooltipText: isDark ? '#F8FAFC' : '#0F172A',
    primaryColor: isDark ? '#3B82F6' : '#2563EB',
    primaryHover: isDark ? '#60A5FA' : '#1D4ED8',
    accentColor: isDark ? '#60A5FA' : '#2563EB',
  };
}

