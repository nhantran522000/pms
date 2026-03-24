import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';

export interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout component integrating Sidebar and BottomTabBar
 * Provides responsive layout shell for dashboard pages
 *
 * Per CONTEXT.md: "Home screen: Cross-module summary dashboard"
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:pl-64">
        {/* Top spacer for mobile content to avoid bottom nav overlap */}
        <main className="pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
