import { type LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  domain: string;
}

// Navigation items organized by domain
// Per CONTEXT.md: "Module organization: By domain (Finance: Financial, Habits & Tasks, Health: Health, Productivity: Notes, Hobbies)"
export const navigationItems: NavigationItem[] = [
  // Finance domain
  {
    name: 'Financial',
    href: '/financial',
    icon: require('lucide-react').DollarSign,
    description: 'Transactions, budgets, and spending insights',
    domain: 'Finance',
  },
  // Habits & Tasks domain
  {
    name: 'Habits',
    href: '/habits',
    icon: require('lucide-react').CheckSquare2,
    description: 'Track habits and build streaks',
    domain: 'Habits & Tasks',
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: require('lucide-react').ListTodo,
    description: 'Manage one-off tasks and deadlines',
    domain: 'Habits & Tasks',
  },
  // Health domain
  {
    name: 'Health',
    href: '/health',
    icon: require('lucide-react').Heart,
    description: 'Vitals, sleep, and fitness tracking',
    domain: 'Health',
  },
  // Productivity domain
  {
    name: 'Notes',
    href: '/notes',
    icon: require('lucide-react').FileText,
    description: 'Journal, notes, and mood tracking',
    domain: 'Productivity',
  },
  {
    name: 'Hobbies',
    href: '/hobbies',
    icon: require('lucide-react').Trophy,
    description: 'Track hobbies and collections',
    domain: 'Productivity',
  },
];

/**
 * Get all module navigation items
 */
export function getModuleNavItems(): NavigationItem[] {
  return navigationItems;
}

/**
 * Get navigation items filtered by domain
 */
export function getModulesByDomain(domain: string): NavigationItem[] {
  return navigationItems.filter((item) => item.domain === domain);
}

/**
 * Get all available domains
 */
export function getDomains(): string[] {
  return Array.from(new Set(navigationItems.map((item) => item.domain)));
}
