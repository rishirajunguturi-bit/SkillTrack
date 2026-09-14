'use client';

import * as React from 'react';
import Link from 'next/link';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'ST';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button className="flex items-center gap-2.5 outline-none group rounded-full p-1 hover:bg-[#281a3a] transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-bold text-xs text-foreground leading-snug">
              {user.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none">
              {user.role === 'ADMIN' ? 'Administrator' : user.role === 'TRAINER' ? 'Trainer' : 'Trainee'}
            </span>
          </div>
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          className="z-50 min-w-[200px] rounded-2xl border border-border bg-[#1c132b] p-1.5 shadow-xl text-sm space-y-1 text-foreground"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
          </div>

          <DropdownMenuPrimitive.Item asChild>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-[#281a3a] hover:text-[#ffad8a] outline-none font-semibold text-xs text-foreground transition-colors"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Item asChild>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-[#281a3a] hover:text-[#ffad8a] outline-none font-semibold text-xs text-foreground transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuPrimitive.Item>

          <div className="border-t border-border pt-1">
            <DropdownMenuPrimitive.Item
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 outline-none font-semibold text-xs transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuPrimitive.Item>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}


