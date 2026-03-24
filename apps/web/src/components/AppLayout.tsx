import { Providers } from './Providers';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
