import { Providers as ClientProviders } from './Providers.client';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
