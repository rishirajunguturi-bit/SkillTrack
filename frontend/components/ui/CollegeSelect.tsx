'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, X, Check, Building2, ChevronDown, RefreshCw, MapPin, PlusCircle } from 'lucide-react';
import { collegeService } from '@/services/college.service';
import { College } from '@/types/college';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CollegeSelectProps {
  label?: string;
  value?: string;
  onChange: (value: string, collegeObj?: College) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const indianStates = [
  'All States',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Odisha',
  'Gujarat',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Assam',
  'Bihar',
];

export function CollegeSelect({
  label,
  value = '',
  onChange,
  error,
  placeholder = 'Search and select your engineering college...',
  disabled = false,
  className,
}: CollegeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Request Addition Modal state
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [reqStudentName, setReqStudentName] = useState('');
  const [reqStudentEmail, setReqStudentEmail] = useState('');
  const [reqCollegeName, setReqCollegeName] = useState('');
  const [reqCity, setReqCity] = useState('');
  const [reqState, setReqState] = useState('Andhra Pradesh');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Server-side debounced search query with state filter
  const {
    data: colleges = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collegesSearch', debouncedQuery, selectedStateFilter],
    queryFn: () =>
      collegeService.searchColleges(
        debouncedQuery,
        selectedStateFilter === 'All States' ? undefined : selectedStateFilter
      ),
    enabled: isOpen,
    staleTime: 60 * 1000,
  });

  const requestCollegeMutation = useMutation({
    mutationFn: () =>
      collegeService.requestCollegeAddition({
        studentName: reqStudentName,
        studentEmail: reqStudentEmail,
        collegeName: reqCollegeName,
        city: reqCity,
        state: reqState,
      }),
    onSuccess: () => {
      toast.success('College addition request submitted for admin review!');
      setIsRequestOpen(false);
      setReqCollegeName('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    },
  });

  const handleSelect = (college: College | string) => {
    if (typeof college === 'string') {
      onChange(college);
    } else {
      onChange(college.name, college);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, colleges.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + colleges.length) % Math.max(1, colleges.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (colleges.length > 0 && colleges[highlightedIndex]) {
        handleSelect(colleges[highlightedIndex]);
      }
    }
  };

  return (
    <div className={cn('space-y-1.5 relative', className)} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Main Select Button Display */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }
        }}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center justify-between w-full h-10 px-3.5 rounded-md border text-sm transition-all cursor-pointer select-none bg-surface focus:outline-none',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : isOpen
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-muted-foreground/30',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <span
            className={cn(
              'truncate font-normal',
              value ? 'text-foreground font-semibold' : 'text-muted-foreground'
            )}
          >
            {value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'transform rotate-180 text-primary'
            )}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search & State Filter Bar Input */}
          <div className="p-2.5 border-b border-border bg-surface-secondary/50 space-y-2">
            <div className="relative flex items-center">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search engineering college (e.g. Prasad, IIT, PVPSIT)..."
                className="w-full h-9 pl-9 pr-8 text-xs bg-surface border border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick State Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {indianStates.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStateFilter(st === 'All States' ? '' : st)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-full shrink-0 font-medium transition-colors text-xs',
                    (st === 'All States' && !selectedStateFilter) || selectedStateFilter === st
                      ? 'bg-primary text-white'
                      : 'bg-surface text-muted-foreground hover:bg-surface-secondary border border-border'
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* College Options List */}
          <div className="max-h-64 overflow-y-auto p-1 space-y-0.5 text-xs">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground font-medium">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Searching colleges...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-5 space-y-2 text-red-500 text-xs">
                <p>Unable to load colleges.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-3 py-1 rounded-md border border-red-200 text-red-600 font-medium hover:bg-red-50"
                >
                  Retry
                </button>
              </div>
            ) : colleges.length > 0 ? (
              colleges.map((c, index) => {
                const isSelected = value === c.name;
                const isHighlighted = highlightedIndex === index;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => handleSelect(c)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-md flex flex-col gap-0.5 transition-colors',
                      isSelected
                        ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-bold border-l-2 border-[#ffad8a] rounded-xl'
                        : isHighlighted
                        ? 'bg-[#281a3a] text-foreground font-medium'
                        : 'text-foreground hover:bg-[#281a3a]/60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2 font-medium">{c.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{c.city}, {c.state}</span>
                      {c.type && (
                        <span className="px-1.5 py-0.2 rounded-full bg-surface-secondary text-muted-foreground font-medium text-[10px]">
                          {c.type}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 space-y-2 text-muted-foreground text-xs">
                <p className="font-medium text-foreground">No engineering colleges found.</p>
                <p className="text-[11px]">Try another search term or state filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setReqCollegeName(searchQuery);
                    setIsRequestOpen(true);
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white font-medium hover:bg-primary-hover"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Request addition
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unlisted College Request Dialog */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request college addition</DialogTitle>
            <DialogDescription>
              If your engineering institution is not listed, submit a request for administrator verification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Input label="Your name" placeholder="Sarthak Sharma" value={reqStudentName} onChange={(e) => setReqStudentName(e.target.value)} />
            <Input label="Your email" type="email" placeholder="student@college.edu" value={reqStudentEmail} onChange={(e) => setReqStudentEmail(e.target.value)} />
            <Input label="College full name" placeholder="e.g. Prasad V. Potluri Siddhartha Institute of Technology" value={reqCollegeName} onChange={(e) => setReqCollegeName(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" placeholder="Vijayawada" value={reqCity} onChange={(e) => setReqCity(e.target.value)} />
              <Input label="State" placeholder="Andhra Pradesh" value={reqState} onChange={(e) => setReqState(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => requestCollegeMutation.mutate()}
              isLoading={requestCollegeMutation.isPending}
              disabled={!reqCollegeName || !reqCity || !reqStudentEmail}
            >
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

