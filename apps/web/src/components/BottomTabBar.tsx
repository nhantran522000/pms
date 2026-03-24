import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getModuleNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

/**
 * BottomTabBar component for mobile navigation
 * Visible only on mobile (<768px width)
 *
 * Per CONTEXT.md: "Navigation pattern: Sidebar (desktop) + bottom tab bar (mobile)"
 * Per CONTEXT.md: "Mobile breakpoint: Bottom tab navigation below 768px width"
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const navItems = getModuleNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50">
      {/* Scrollable container for many tabs */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-[4rem] max-w-[5rem] py-2 px-1 transition-colors',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 mb-1 flex-shrink-0',
                  isActive && 'stroke-2'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area inset for devices with home indicator */}
      <div className="h-safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
