import Link from 'next/link';
import { getModuleNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

/**
 * Sidebar component for desktop navigation
 * Visible only on desktop (≥768px width)
 *
 * Per CONTEXT.md: "Navigation pattern: Sidebar (desktop) + bottom tab bar (mobile)"
 * Per CONTEXT.md: "Mobile breakpoint: Bottom tab navigation below 768px width"
 */
export function Sidebar() {
  const navItems = getModuleNavItems();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Logo/Header */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            PMS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Personal Management System
        </p>
      </div>
    </aside>
  );
}
