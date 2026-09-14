'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Code, ChevronDown, RefreshCw, Sparkles } from 'lucide-react';
import { Skill } from '@/types/skill';
import { cn } from '@/lib/utils';

interface SkillSelectProps {
  skills: Skill[];
  value?: string;
  onChange: (skillId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SkillSelect({
  skills = [],
  value = '',
  onChange,
  isLoading = false,
  isError = false,
  onRetry,
  label,
  error,
  placeholder = 'Select a technical skill...',
  disabled = false,
  className,
}: SkillSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Currently selected skill object
  const selectedSkill = useMemo(
    () => skills.find((s) => s._id === value),
    [skills, value]
  );

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    const query = searchQuery.toLowerCase().trim();
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        (s.category && s.category.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
    );
  }, [skills, searchQuery]);

  // Group filtered skills by category
  const groupedSkills = useMemo(() => {
    const groups: { [category: string]: Skill[] } = {};
    for (const skill of filteredSkills) {
      const cat = skill.category || 'Other';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(skill);
    }
    return groups;
  }, [filteredSkills]);

  // Flattened list for keyboard navigation index lookup
  const flattenedFilteredSkills = useMemo(() => {
    const list: Skill[] = [];
    Object.values(groupedSkills).forEach((group) => {
      list.push(...group);
    });
    return list;
  }, [groupedSkills]);

  const handleSelect = (skillId: string) => {
    onChange(skillId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  // Keyboard navigation support (ArrowDown, ArrowUp, Enter, Escape)
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
      setHighlightedIndex((prev) =>
        prev < flattenedFilteredSkills.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : flattenedFilteredSkills.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flattenedFilteredSkills.length > 0 && flattenedFilteredSkills[highlightedIndex]) {
        handleSelect(flattenedFilteredSkills[highlightedIndex]._id);
      }
    }
  };

  return (
    <div
      className={cn('space-y-1.5 relative select-none', className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Main Combobox Closed Display Button */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="skill-select-popover"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => searchInputRef.current?.focus(), 80);
          }
        }}
        className={cn(
          'flex items-center justify-between w-full h-10 px-3.5 rounded-md border text-sm transition-all cursor-pointer bg-surface focus:outline-none',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : isOpen
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-muted-foreground/30',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          {selectedSkill ? (
            <Code className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          )}

          {selectedSkill ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-foreground truncate">
                {selectedSkill.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                • {selectedSkill.category}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedSkill && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors"
              title="Clear skill"
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

      {/* Custom Animated Combobox Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="skill-select-popover"
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="p-2.5 border-b border-border bg-surface-secondary/50">
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
                  placeholder="Search technical skills (e.g. React, Python)..."
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
            </div>

            {/* Scrollable Grouped Skill List */}
            <div className="max-h-80 overflow-y-auto p-1.5 space-y-3 text-xs scrollbar-thin">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-xs text-muted-foreground font-medium">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <span>Loading skill catalog...</span>
                </div>
              ) : isError ? (
                <div className="text-center py-6 space-y-2 text-red-500 text-xs">
                  <p>Unable to load skills from backend.</p>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="px-3 py-1 rounded-md border border-red-200 text-red-600 font-medium hover:bg-red-50"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ) : Object.keys(groupedSkills).length > 0 ? (
                Object.entries(groupedSkills).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    {/* Category Header */}
                    <div className="text-xs font-semibold text-muted-foreground px-2.5 py-1 rounded-md bg-surface-secondary/50 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>{category}</span>
                    </div>

                    {/* Category Items */}
                    <div className="space-y-0.5 pt-0.5">
                      {items.map((skill) => {
                        const isSelected = value === skill._id;
                        const flatIdx = flattenedFilteredSkills.findIndex(
                          (s) => s._id === skill._id
                        );
                        const isHighlighted = highlightedIndex === flatIdx;

                        return (
                          <button
                            key={skill._id}
                            type="button"
                            onClick={() => handleSelect(skill._id)}
                            onMouseEnter={() => setHighlightedIndex(flatIdx)}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors',
                              isSelected
                                ? 'bg-[#ffad8a]/15 text-[#ffad8a] font-bold border-l-2 border-[#ffad8a] rounded-xl'
                                : isHighlighted
                                ? 'bg-[#281a3a] text-foreground font-medium'
                                : 'text-foreground hover:bg-[#281a3a]/60'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <Code
                                className={cn(
                                  'h-3.5 w-3.5 shrink-0',
                                  isSelected
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                )}
                              />
                              <span className="truncate">{skill.name}</span>
                            </div>

                            {isSelected && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-1 text-muted-foreground text-xs">
                  <p className="font-medium text-foreground">No skills found.</p>
                  <p className="text-[11px]">Try another search term.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


