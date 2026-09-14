'use client';

import { AppNotification } from '@/types/notification';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Award,
  Target,
  BookOpen,
  Shield,
  Sparkles,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface NotificationDetailModalProps {
  notification: AppNotification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkRead,
  onDelete,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT_COMPLETED':
        return <Award className="h-5 w-5 text-purple-400" />;
      case 'GOAL_COMPLETED':
        return <Target className="h-5 w-5 text-emerald-400" />;
      case 'LEARNING_COMPLETED':
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'PASSWORD_SECURITY':
        return <Shield className="h-5 w-5 text-rose-400" />;
      case 'ADMIN_MESSAGE':
        return <Mail className="h-5 w-5 text-amber-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-400" />;
    }
  };

  const formattedDate = new Date(notification.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-[#1c132b] text-[#fff9fc] border border-zinc-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-6">
            <div className="p-2.5 rounded-xl bg-[#281a3a] border border-border shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <Badge variant="purple" className="text-[10px] uppercase font-bold py-0">
                {notification.type.replace('_', ' ')}
              </Badge>
              <DialogTitle className="text-base font-extrabold text-[#fff9fc] mt-1">
                {notification.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Full Message Body */}
        <div className="space-y-4 py-3 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-[#281a3a]/60 border border-zinc-800 leading-relaxed font-normal whitespace-pre-wrap">
            {notification.message}
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <span>{formattedDate}</span>
            </div>

            <Badge variant={notification.read ? 'outline' : 'success'} className="text-[10px]">
              {notification.read ? 'Read' : 'Unread'}
            </Badge>
          </div>
        </div>

        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
          {!notification.read && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkRead(notification._id)}
              className="text-xs gap-1.5 border-purple-800 text-purple-300 hover:bg-purple-950/60"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Mark as Read
            </Button>
          )}

          {notification.link && (
            <Link href={notification.link} onClick={onClose}>
              <Button size="sm" className="text-xs gap-1.5 bg-[#ffad8a] text-[#2b1120] hover:bg-[#ff9c70] font-bold">
                <ExternalLink className="h-3.5 w-3.5" />
                View Target Page
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(notification._id);
              onClose();
            }}
            className="text-xs text-rose-400 hover:bg-rose-950/40"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
