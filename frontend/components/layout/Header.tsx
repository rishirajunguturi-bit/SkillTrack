'use client';

import { usePathname } from 'next/navigation';
import { UserNav } from './UserNav';
import { MobileNav } from './MobileNav';
import { NotificationCenter } from './NotificationCenter';
import Link from 'next/link';

export function Header() {
  const pathname = usePathname();

  // Generate clean page title from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const rawTitle = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ')
    : 'Dashboard';

  const formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 w-full bg-[#1c132b]/95 backdrop-blur-md border-b border-white/10 px-6 sm:px-8 transition-colors duration-150 select-none">
      {/* Left Section: Mobile Nav & Page Title */}
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="flex items-center gap-2">
          {pathSegments.length > 1 && (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
              {pathSegments[0]} /
            </span>
          )}
          <h1 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
            {formattedTitle}
          </h1>
        </div>
      </div>

      {/* Right Section: Notifications & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        <NotificationCenter />
        <div className="h-5 w-px bg-white/10 hidden sm:block" />
        <UserNav />
      </div>
    </header>
  );
}
