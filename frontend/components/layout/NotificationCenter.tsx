'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  Award,
  Target,
  BookOpen,
  Shield,
  Sparkles,
  Mail,
  X,
  ExternalLink,
} from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { AppNotification, NotificationType } from '@/types/notification';
import { Badge } from '@/components/ui/Badge';
import { NotificationDetailModal } from '@/components/notifications/NotificationDetailModal';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Unread Count Query
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadNotificationCount'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60 * 1000,
    staleTime: 15 * 1000,
  });

  // Notifications List Query (enabled when dropdown open)
  const { data: listData, isLoading } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: () => notificationService.getUserNotifications(1, 20),
    enabled: isOpen,
    staleTime: 15 * 1000,
  });

  // Mark Read Mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    },
  });

  // Mark All Read Mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    },
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'ASSESSMENT_COMPLETED':
        return <Award className="h-4 w-4 text-purple-400" />;
      case 'GOAL_COMPLETED':
        return <Target className="h-4 w-4 text-emerald-400" />;
      case 'LEARNING_COMPLETED':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'PASSWORD_SECURITY':
        return <Shield className="h-4 w-4 text-rose-400" />;
      case 'ADMIN_MESSAGE':
        return <Mail className="h-4 w-4 text-amber-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-400" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  };

  const notifications = listData?.notifications || [];

  const handleNotificationClick = (item: AppNotification) => {
    setSelectedNotification(item);
    if (!item.read) {
      markReadMutation.mutate(item._id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className="relative p-2 rounded-full text-muted-foreground hover:bg-surface-secondary hover:text-foreground transition-colors focus:outline-none cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffad8a] text-[10px] font-bold text-[#2b1120] shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel — Compact Preview List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#1c132b] border border-border shadow-2xl z-50 overflow-hidden text-foreground"
          >
            {/* Header */}
            <div className="p-3.5 px-4 border-b border-border flex items-center justify-between bg-[#281a3a]/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-foreground">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Badge variant="warning" className="text-xs py-0.5 bg-[#ffad8a]/20 text-[#ffad8a] border-[#ffad8a]/30">
                    {unreadCount} new
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    disabled={markAllReadMutation.isPending}
                    className="text-xs font-semibold text-[#ffad8a] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification Preview List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/60 scrollbar-thin">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-muted-foreground">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell className="h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const messageSnippet =
                    item.message.length > 55 ? `${item.message.slice(0, 55)}...` : item.message;

                  return (
                    <div
                      key={item._id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 transition-colors flex items-start gap-3 relative group cursor-pointer ${
                        !item.read
                          ? 'bg-[#ffad8a]/10 border-l-2 border-[#ffad8a]'
                          : 'hover:bg-[#281a3a]/40'
                      }`}
                    >
                      {/* Unread Indicator Dot */}
                      {!item.read && (
                        <span className="absolute top-4 left-1.5 h-1.5 w-1.5 rounded-full bg-[#ffad8a]" />
                      )}

                      {/* Icon Container */}
                      <div className="p-2 rounded-xl bg-[#281a3a] shrink-0 mt-0.5 border border-border">
                        {getNotificationIcon(item.type)}
                      </div>

                      {/* Snippet Content (PREVIEW ONLY) */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className="text-xs font-bold text-foreground truncate max-w-[190px]">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {messageSnippet}
                        </p>
                      </div>

                      {/* Delete Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(item._id);
                        }}
                        title="Delete notification"
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Detail View Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={(id) => markReadMutation.mutate(id)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
}
