# Phase 10: Mobile Client - Research

**Researched:** 2026-03-24
**Domain:** Cross-platform mobile development with Expo SDK 55
**Confidence:** HIGH

## Summary

Phase 10 requires building a cross-platform mobile application using Expo SDK 55 with React Native 0.84.1, NativeWind v4 styling, Expo Router navigation, and full offline capability with queue-based synchronization. The mobile app will share TanStack Query data-access hooks with the web client, requiring extraction to a shared library. Authentication must migrate from cookie-based (web) to JWT token-based (mobile) stored in AsyncStorage. The app will implement Expo Push notifications for all 5 modules (Financial, Habits, Health, Tasks, Notes) with timezone-aware timing and quiet hours (10 PM - 7 AM local time).

**Primary recommendation:** Use Expo SDK 55 with Expo Router for file-based navigation, NativeWind v4 for Tailwind-compatible styling, expo-sqlite for offline queue persistence, and extract TanStack Query hooks to `libs/shared-data-access` for code sharing between web and mobile clients.

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Navigation Structure:**
- 5 bottom tabs: Dashboard, Financial, Habits, Health, Profile — matches web sidebar, familiar mobile pattern
- Stack navigation per module — each tab has its own stack for drill-down (e.g., Financial → Transaction Details)
- Notes lives in Profile tab as a menu item — less frequently accessed, keeps tabs focused

**Push Notification Types:**
- All 5 modules get push notifications: Financial (budget alerts), Habits (streak reminders), Health (weekly digest ready), Tasks (overdue), Notes (shared)
- Timezone-aware timing: 9 AM local for reminders, weekly digest at user-selected time
- Quiet hours: 10 PM - 7 AM local time — no notifications during sleep hours

**Offline Queue Strategy:**
- All writes queued offline: create/update/delete across modules — full offline capability
- Queue persistence via expo-sqlite with periodic sync (5 min interval + immediate on reconnect)
- Conflict resolution: last-write-wins with server timestamp — simple, handles most cases

### Claude's Discretion

Expo Router file structure, NativeWind configuration approach, offline queue implementation details (library choice: expo-sqlite vs AsyncStorage), push notification payload format.

### Deferred Ideas (OUT OF SCOPE)

- Biometric auth (Face ID / fingerprint) — defer to v2, initial release with email/password
- Deep linking for push notification taps — can be added later
- Background sync for large datasets — initial sync on app open sufficient for v1
- Widget support (iOS/Android home screen widgets) — nice-to-have, not core v1

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MOB-01 | Expo SDK 55 with React Native 0.83 | Verified: Expo SDK 55.0.8 available, RN 0.84.1 is latest (0.83 acceptable) |
| MOB-02 | NativeWind for styling (Tailwind for React Native) | NativeWind v4.2.3 with build-time compilation documented |
| MOB-03 | Expo Router for file-based navigation | Expo Router v55.0.7 with file-based routing patterns verified |
| MOB-04 | Expo Push notifications integration | expo-notifications v55.0.13 with development build requirement |
| MOB-05 | Shared data-access hooks with web client | TanStack Query v5.95.2 extraction strategy documented |
| MOB-06 | Offline queue for actions without connectivity | expo-sqlite v55.0.11 with NetInfo v12.0.1 for offline detection |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo | 55.0.8 | Expo SDK core | Latest stable SDK with React Native 0.84, provides managed workflow |
| react-native | 0.84.1 | Core framework | Latest version bundled with Expo SDK 55 |
| nativewind | 4.2.3 | Tailwind CSS for React Native | Build-time compilation, minimal runtime, matches web Tailwind approach |
| expo-router | 55.0.7 | File-based navigation | Universal routing (Android/iOS/web), deep linking, async routes |
| expo-notifications | 55.0.13 | Push notifications | Unified API for local/remote notifications, channel support |
| @tanstack/react-query | 5.95.2 | Server state management | Already used in web client v5.95.2, consistent caching |
| expo-sqlite | 55.0.11 | Offline queue storage | Robust SQLite persistence for queue with sync tracking |
| @react-native-async-storage/async-storage | 3.0.1 | Token storage | JWT token persistence for authentication |
| @react-native-community/netinfo | 12.0.1 | Network detection | Offline/online state detection for sync triggers |
| tailwindcss | 3.4.3 | Style framework | Already in web client, shared config with NativeWind |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-navigation/native | latest | Navigation foundation | Required by Expo Router, provides context |
| expo-status-bar | latest | Status bar config | Platform-specific status bar styling |
| expo-constants | latest | App constants | Access app config, device info |
| expo-device | latest | Device detection | Platform-specific logic |
| date-fns | latest | Date/time utilities | Timezone-aware notification scheduling |
| zustand | latest | Client state (optional) | If needed for UI state outside TanStack Query |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| expo-sqlite | AsyncStorage | Less robust for complex queue tracking, no SQL queries |
| NativeWind | StyleSheet | Loses Tailwind consistency with web, more verbose styles |
| Expo Router | React Navigation | More boilerplate, no file-based routing, manual deep linking |
| TanStack Query | Redux + RTK Query | More boilerplate, built-in caching less sophisticated |

**Installation:**

```bash
# Create Expo app with SDK 55
npx create-expo-app@latest --template default@sdk-55 apps/mobile

# Install dependencies
pnpm add nativewind@4.2.3 expo-router@55.0.7 expo-notifications@55.0.13
pnpm add expo-sqlite@55.0.11 @react-native-async-storage/async-storage@3.0.1
pnpm add @react-native-community/netinfo@12.0.1
pnpm add @tanstack/react-query@5.95.2 date-fns

# Development dependencies
pnpm add -D tailwindcss@3.4.3 @types/react-native

# Add Nx plugin for Expo
pnpm add -D @nx/expo@latest
```

**Version verification:** All package versions verified current as of 2026-03-24:
- Expo SDK 55.0.8: Latest stable, includes React Native 0.84.1
- NativeWind 4.2.3: Latest v4 with build-time compilation
- Expo Router 55.0.7: Latest SDK 55-compatible version
- TanStack Query 5.95.2: Latest v5, matches web client version

## Architecture Patterns

### Recommended Project Structure

```
apps/
├── mobile/                      # Expo app
│   ├── app/                     # Expo Router file-based routes
│   │   ├── (tabs)/             # Bottom tab layout group
│   │   │   ├── _layout.tsx     # Tab navigator config
│   │   │   ├── dashboard.tsx   # Dashboard tab
│   │   │   ├── financial.tsx   # Financial tab
│   │   │   ├── habits.tsx      # Habits tab
│   │   │   ├── health.tsx      # Health tab
│   │   │   └── profile.tsx     # Profile tab (includes Notes menu item)
│   │   ├── financial/          # Financial stack routes
│   │   │   ├── transactions/   # Transaction list/detail
│   │   │   ├── accounts/       # Account management
│   │   │   └── budgets/        # Budget management
│   │   ├── habits/             # Habits stack routes
│   │   ├── health/             # Health stack routes
│   │   ├── tasks/              # Tasks stack routes
│   │   ├── _layout.tsx         # Root layout with providers
│   │   └── global-error.tsx    # Error boundary
│   ├── src/
│   │   ├── components/         # Shared mobile components
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── navigation/     # Navigation helpers
│   │   ├── lib/
│   │   │   ├── api/            # Mobile-specific API client (token-based auth)
│   │   │   ├── auth/           # Auth utilities (AsyncStorage token management)
│   │   │   └── queue/          # Offline queue implementation
│   │   ├── hooks/              # Mobile-specific hooks (auth, network)
│   │   ├── services/           # Push notification service, sync service
│   │   └── utils/              # Utilities (date formatting, etc.)
│   ├── assets/                 # Images, fonts, icons
│   ├── tailwind.config.js      # NativeWind config
│   ├── nativewind-env.d.ts     # NativeWind TypeScript types
│   ├── app.json                # Expo app config
│   └── package.json
├── web/                        # Existing Next.js web client
│   └── src/
│       └── hooks/              # TanStack Query hooks to extract
│           ├── useFinancialData.ts
│           ├── useHabitsData.ts
│           ├── useHealthData.ts
│           ├── useTasksData.ts
│           ├── useNotesData.ts
│           └── useHobbiesData.ts
└── api/                        # Existing NestJS backend

libs/
├── shared-data-access/         # NEW: Shared TanStack Query hooks
│   ├── src/
│   │   ├── hooks/              # Extracted hooks from web
│   │   ├── api/                # Shared API client functions
│   │   ├── query-keys/         # Query key factories
│   │   └── types/              # Shared TypeScript interfaces
│   └── package.json
├── shared-types/               # Existing shared types
├── shared-kernel/              # Existing shared kernel
└── data-access/                # Existing Prisma data access
```

### Pattern 1: Expo Router File-Based Navigation

**What:** File-system based routing where files in `app/` directory become routes automatically. Uses layout groups `(...)` for tab navigation.

**When to use:** All navigation in the mobile app. Bottom tabs use `(tabs)` group, module-specific stacks use folders with `_layout.tsx`.

**Example:**
```typescript
// apps/mobile/app/(tabs)/_layout.tsx
// Source: https://docs.expo.dev/router/introduction/
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#6366f1', // indigo-500
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="financial"
        options={{
          title: 'Financial',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Pattern 2: NativeWind Styling with Tailwind

**What:** Build-time compilation of Tailwind CSS to React Native styles. Uses `className` prop instead of `style`.

**When to use:** All component styling in the mobile app for consistency with web's Tailwind approach.

**Example:**
```typescript
// apps/mobile/src/components/ui/Button.tsx
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ onPress, variant = 'primary', children }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        px-4 py-3 rounded-lg items-center justify-center
        ${variant === 'primary'
          ? 'bg-indigo-500 active:bg-indigo-600'
          : 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700'
        }
      `}
    >
      <Text className={`
        font-semibold text-base
        ${variant === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'}
      `}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
```

**Configuration (tailwind.config.js):**
```javascript
// apps/mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1', // indigo-500
          600: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
};
```

### Pattern 3: Shared TanStack Query Hooks

**What:** Extract TanStack Query hooks from web client to shared library for use by both web and mobile.

**When to use:** All data fetching operations to ensure consistency between web and mobile clients.

**Example (shared library):**
```typescript
// libs/shared-data-access/src/hooks/useFinancialData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccounts, createAccount } from '../api/financial';
import { queryKeys } from '../query-keys';

export function useAccounts(includeArchived = false) {
  return useQuery({
    queryKey: queryKeys.accounts.list(includeArchived),
    queryFn: () => getAccounts(includeArchived),
    staleTime: 30_000, // 30 seconds
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.all,
      });
    },
  });
}
```

**Query key factory pattern:**
```typescript
// libs/shared-data-access/src/query-keys/index.ts
export const queryKeys = {
  accounts: {
    all: ['financial', 'accounts'] as const,
    lists: () => ['financial', 'accounts', 'list'] as const,
    list: (includeArchived: boolean) =>
      ['financial', 'accounts', 'list', { includeArchived }] as const,
    details: () => ['financial', 'accounts', 'detail'] as const,
    detail: (id: string) => ['financial', 'accounts', 'detail', id] as const,
  },
  transactions: {
    all: ['financial', 'transactions'] as const,
    lists: () => ['financial', 'transactions', 'list'] as const,
    list: (filters?: TransactionFilters) =>
      ['financial', 'transactions', 'list', filters] as const,
  },
  // ... other modules
};
```

### Pattern 4: Platform-Aware API Client

**What:** Unified API client that handles cookie auth (web) vs token auth (mobile) transparently.

**When to use:** All API calls from both web and mobile clients.

**Example (shared data-access):**
```typescript
// libs/shared-data-access/src/api/client.ts
interface ApiClientConfig {
  baseUrl: string;
  getAuthToken?: () => Promise<string | null>; // Mobile: read from AsyncStorage
  useCookies?: boolean; // Web: true, Mobile: false
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: ApiClientConfig
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Mobile: Add Authorization header with JWT
  if (config.getAuthToken && !config.useCookies) {
    const token = await config.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: config.useCookies ? 'include' : 'omit', // Web: include, Mobile: omit
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}
```

**Mobile usage:**
```typescript
// apps/mobile/src/lib/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '@pms/shared-data-access';

const AUTH_TOKEN_KEY = '@pms:auth_token';

export async function getAuthToken() {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: 'GET' }, {
    baseUrl: API_BASE_URL,
    getAuthToken,
    useCookies: false,
  }),
  post: <T>(url: string, body: unknown) => apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }, {
    baseUrl: API_BASE_URL,
    getAuthToken,
    useCookies: false,
  }),
  // ... put, delete
};
```

### Pattern 5: Offline Queue with expo-sqlite

**What:** SQLite-based queue for persisting offline mutations with background sync.

**When to use:** All write operations (create/update/delete) to support offline-first capability.

**Example queue implementation:**
```typescript
// apps/mobile/src/lib/queue/OfflineQueue.ts
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

interface QueueItem {
  id: string;
  mutation: string; // 'createTransaction', 'updateHabit', etc.
  payload: string; // JSON stringified
  timestamp: number;
  retryCount: number;
}

export class OfflineQueue {
  private db: SQLite.SQLiteDatabase;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.db = SQLite.openDatabaseSync('offline_queue.db');
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS queue (
        id TEXT PRIMARY KEY,
        mutation TEXT NOT NULL,
        payload TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        retryCount INTEGER DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS timestamp_idx ON queue(timestamp);
    `);
  }

  async enqueue(mutation: string, payload: unknown): Promise<void> {
    const item: QueueItem = {
      id: crypto.randomUUID(),
      mutation,
      payload: JSON.stringify(payload),
      timestamp: Date.now(),
      retryCount: 0,
    };

    await this.db.runAsync(
      'INSERT INTO queue (id, mutation, payload, timestamp, retryCount) VALUES (?, ?, ?, ?, ?)',
      [item.id, item.mutation, item.payload, item.timestamp, item.retryCount]
    );

    // Trigger immediate sync if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    const items = await this.db.getAllAsync<QueueItem>(
      'SELECT * FROM queue ORDER BY timestamp ASC LIMIT 50'
    );

    for (const item of items) {
      try {
        await this.executeMutation(item.mutation, JSON.parse(item.payload));
        await this.db.runAsync('DELETE FROM queue WHERE id = ?', [item.id]);
      } catch (error) {
        console.error(`Failed to process queue item ${item.id}:`, error);
        await this.db.runAsync(
          'UPDATE queue SET retryCount = retryCount + 1 WHERE id = ?',
          [item.id]
        );
      }
    }
  }

  startPeriodicSync(intervalMs: number = 5 * 60 * 1000): void {
    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    // Also sync when connectivity is restored
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.processQueue();
      }
    });
  }

  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async executeMutation(mutation: string, payload: unknown): Promise<void> {
    // Route to appropriate API call based on mutation type
    switch (mutation) {
      case 'createTransaction':
        return api.post('/financial/transactions', payload);
      case 'updateHabit':
        return api.put(`/habits/${(payload as any).id}`, payload);
      // ... other mutation types
      default:
        throw new Error(`Unknown mutation type: ${mutation}`);
    }
  }
}
```

### Anti-Patterns to Avoid

- **Direct StyleSheet usage instead of NativeWind:** Loses consistency with web's Tailwind approach, more verbose styles
- **Duplicating API logic:** Always use shared data-access library, don't copy-paste API functions between web and mobile
- **Not handling offline state:** Always check network status and queue mutations when offline
- **Ignoring AsyncStorage token expiry:** Implement token refresh logic or clear expired tokens
- **Hardcoded notification times:** Use timezone-aware scheduling (date-fns-tz or Expo's local notifications)
- **Global state without TanStack Query:** Use TanStack Query for server state, only use Zustand/client state for UI-only state

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Offline queue persistence | Custom AsyncStorage queue | expo-sqlite | ACID transactions, SQL queries for complex filtering, better performance |
| Network detection | Custom fetch/ping logic | @react-native-community/netinfo | Platform-optimized, handles all edge cases (airplane mode, wifi without internet) |
| Token storage | AsyncStorage directly | SecureStore for sensitive tokens | Encrypted storage, iOS Keychain/Android Keystore integration |
| Push notification scheduling | Custom cron implementation | expo-notifications scheduling | Native integration, respects Doze mode, handles timezones |
| Style compilation | Custom StyleSheet generators | NativeWind | Build-time compilation, Tailwind ecosystem, dev tooling |
| File-based routing | Manual navigator config | Expo Router | Deep linking, automatic route typing, async routes, SEO on web |

**Key insight:** Mobile development has mature solutions for common problems. Building custom implementations for offline persistence, network detection, token security, push notifications, or routing introduces unnecessary complexity and maintenance burden. Expo Router provides file-based routing with deep linking out of the box. NativeWind compiles Tailwind at build time for native performance. expo-notifications handles cross-platform push notifications with timezone-aware scheduling. expo-sqlite provides robust offline queue persistence with SQL queries. @react-native-community/netinfo handles all network edge cases reliably.

## Common Pitfalls

### Pitfall 1: AsyncStorage Used for Sensitive Tokens

**What goes wrong:** JWT tokens stored in plain AsyncStorage are vulnerable to device extraction attacks on rooted/jailbroken devices.

**Why it happens:** AsyncStorage is not encrypted by default, making it unsuitable for sensitive authentication tokens.

**How to avoid:** Use Expo SecureStore for JWT tokens:
```typescript
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
```

**Warning signs:** Tokens visible in app data directories, security audit failures, app store rejection for financial apps.

### Pitfall 2: Not Handling Async Routes in Expo Router

**What goes wrong:** App crashes or shows blank screens when navigating to routes with heavy data fetching.

**Why it happens:** Expo Router supports async routes (deferred bundling), but requires proper error boundaries and loading states.

**How to avoid:** Use React Suspense with Expo Router's async routes:
```typescript
// apps/mobile/app/financial/transactions.tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { View, ActivityIndicator } from 'react-native';

export function useTransactions() {
  return useSuspenseQuery({
    queryKey: ['financial', 'transactions'],
    queryFn: () => api.get('/financial/transactions'),
  });
}

export default function TransactionsScreen() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading transactions</Text>;
  }

  return <TransactionList transactions={transactions} />;
}
```

**Warning signs:** White screens on navigation, Metro bundler errors, slow route transitions.

### Pitfall 3: Offline Queue Conflicts Without Resolution Strategy

**What goes wrong:** Conflicting updates from offline edits cause data loss or incorrect server state.

**Why it happens:** Last-write-wins without timestamps can overwrite newer server data with stale offline edits.

**How to avoid:** Implement server timestamp comparison in conflict resolution:
```typescript
interface QueuedMutation {
  id: string;
  mutation: string;
  payload: any;
  clientTimestamp: number; // When user made the edit offline
  serverTimestamp?: number; // Server version client last saw
}

async function executeMutation(item: QueuedMutation) {
  // Fetch current server state
  const current = await api.get(`/resource/${item.payload.id}`);

  // Conflict: server was updated after client's last known version
  if (item.serverTimestamp && current.updatedAt > item.serverTimestamp) {
    // Handle conflict: prompt user or merge
    return handleConflict(item, current);
  }

  // No conflict: safe to apply
  return api.put(`/resource/${item.payload.id}`, {
    ...item.payload,
    lastKnownUpdate: item.serverTimestamp,
  });
}
```

**Warning signs:** Data mysteriously changing, users complaining about lost edits, audit logs showing overwrites.

### Pitfall 4: NativeWind Configuration Mismatch

**What goes wrong:** Styles not applying on one platform (web vs native) or runtime errors.

**Why it happens:** NativeWind v4 requires specific Babel/TypeScript configuration and different setup for web vs native.

**How to avoid:** Follow NativeWind v4 monorepo setup exactly:
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["nativewind/types"]
  }
}
```

```css
/* apps/mobile/app.css - Dummy CSS file required by NativeWind */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Warning signs:** `className` prop errors, styles not applying on one platform, build failures.

### Pitfall 5: Push Notifications Not Working on Android

**What goes wrong:** Push notifications work on iOS but not Android in Expo Go.

**Why it happens:** Expo Go doesn't support push notifications on Android. Requires development build with EAS.

**How to avoid:** Use development build for testing push notifications:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS project
eas init

# Build development build
eas build --profile development --platform ios

# Or use local development build
npx expo run:android
```

**Warning signs:** Notifications silently failing on Android, Expo Go console errors about missing permissions.

## Code Examples

Verified patterns from official sources:

### Expo Router Bottom Tabs with Stacks

```typescript
// apps/mobile/app/(tabs)/_layout.tsx
// Source: https://docs.expo.dev/router/introduction/
import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="financial"
        options={{
          title: 'Financial',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} />,
        }}
      />
      {/* Financial has its own stack for drill-down navigation */}
    </Tabs>
  );
}
```

### NativeWind Dark Mode Support

```typescript
// apps/mobile/app/_layout.tsx
// Source: https://nativewind.dev/guides/themes
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

### Expo Push Notifications Setup

```typescript
// apps/mobile/src/services/PushNotificationService.ts
// Source: https://docs.expo.dev/versions/latest/sdk/notifications/
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class PushNotificationService {
  async init(): Promise<void> {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Push notification permissions not granted');
      return;
    }

    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configure for Android (channels required)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Get push token for device
    const token = await this.getPushToken();
    console.log('Push token:', token);

    // Register with backend
    await this.registerTokenWithBackend(token);
  }

  async getPushToken(): Promise<string> {
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // From app.json or EAS
    });

    return token;
  }

  async registerTokenWithBackend(token: string): Promise<void> {
    await api.post('/auth/push-token', { token });
  }

  async scheduleNotification(
    title: string,
    body: string,
    date: Date
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { date },
    });
  }

  addNotificationListener(handler: (notification: Notifications.Notification) => void): void {
    Notifications.addNotificationReceivedListener(handler);
  }

  addResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
  ): void {
    Notifications.addNotificationResponseReceivedListener(handler);
  }
}
```

### TanStack Query with Offline Support

```typescript
// apps/mobile/src/hooks/useOfflineMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { offlineQueue } from '../lib/queue/OfflineQueue';

export function useOfflineMutation<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  mutationKey: string[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    mutationKey,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: mutationKey });
    },
    onError: async (error, variables) => {
      const netInfo = await NetInfo.fetch();

      // If offline, enqueue mutation for later
      if (!netInfo.isConnected) {
        await offlineQueue.enqueue(mutationKey[0], variables);
      }
    },
  });
}

// Usage
export function useCreateTransaction() {
  return useOfflineMutation(
    (data) => api.post('/financial/transactions', data),
    ['financial', 'transactions']
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Navigation manual config | Expo Router file-based routing | SDK 50+ (2024) | Simplified navigation, automatic deep linking, async routes |
| StyleSheet.create or inline styles | NativeWind v4 build-time compilation | NativeWind 4.0 (2024) | Tailwind consistency with web, better performance, dev tooling |
| AsyncStorage for everything | expo-sqlite for complex data | Expo SDK 50+ | SQL queries, ACID transactions, better performance for offline queues |
| Custom push notification handling | expo-notifications unified API | SDK 44+ | Cross-platform API, channel support, local scheduling |
| Manual offline detection | @react-native-community/netinfo | NetInfo 12+ | Platform-optimized, handles all edge cases |
| TanStack Query v4 | TanStack Query v5 | 2024 | Better TypeScript support, improved caching, optimistic updates |

**Deprecated/outdated:**
- **React Native CLI (non-Expo):** Loses OTA updates, requires native code for push notifications, harder setup
- **NativeWind v2:** Upgrade to v4 for build-time compilation and better performance
- **AsyncStorage for tokens:** Use SecureStore for sensitive authentication tokens
- **Custom scheduling libraries:** Use expo-notifications scheduling for timezone-aware alarms
- **WebView-based push:** Native expo-notifications required for reliable delivery

## Open Questions

1. **Push notification payload format**
   - What we know: Expo supports custom data in notification payload
   - What's unclear: Exact schema for deep linking to specific screens (e.g., tap notification → open transaction detail)
   - Recommendation: Use standardized payload format with `route` and `params` fields for deep linking

2. **Token refresh strategy**
   - What we know: Mobile uses JWT tokens, need refresh mechanism
   - What's unclear: Backend currently uses cookie-based auth with no token refresh endpoint
   - Recommendation: Implement JWT refresh endpoint in backend before mobile implementation

3. **Offline queue conflict resolution UX**
   - What we know: Last-write-wins with server timestamp is baseline strategy
   - What's unclear: How to present conflicts to user when automatic resolution fails
   - Recommendation: Start with last-write-wins, add conflict dialog UI in v2 if needed

4. **TanStack Query persistence for offline reads**
   - What we know: Queries cache in memory, lost on app restart
   - What's unclear: Whether to persist query cache to AsyncStorage for offline reads
   - Recommendation: Start without persistence (fresh data on app load), add persist-client in v2 if needed

5. **Shared types library structure**
   - What we know: Web client has API response types in each module
   - What's unclear: Whether to extract all types to shared-types or keep in shared-data-access
   - Recommendation: Keep API response types in shared-data-access with their hooks, use shared-types only for domain entities

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Expo CLI | ✓ | v20.19.9 | — |
| pnpm | Package manager | ✓ | Installed | npm |
| iOS Simulator | iOS development | ✓ | macOS + Xcode | Expo Go app |
| Android Studio | Android development | ✗ (likely) | — | Expo Go app |
| EAS CLI | Development builds | ✗ | — | Use Expo Go for initial dev |
| @nx/expo plugin | Nx integration | ✗ | — | Manual configuration |

**Missing dependencies with no fallback:**
- None - Expo Go app provides sufficient development environment for initial implementation

**Missing dependencies with fallback:**
- EAS CLI: Use Expo Go for initial development, add EAS builds when push notifications require development build
- Android Studio: Use Expo Go app on physical Android device or iOS Simulator for initial testing
- @nx/expo plugin: Manually configure Expo app in Nx workspace (add to nx.json, configure targets)

**Installation commands for missing dependencies:**
```bash
# Install EAS CLI when ready for development builds
npm install -g eas-cli
eas init

# Install Nx Expo plugin when ready for full integration
pnpm add -D @nx/expo@latest
nx g @nx/expo:app mobile --directory=apps/mobile
```

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | React Native Testing Library + Jest |
| Config file | `apps/mobile/jest.config.js` (Wave 0) |
| Quick run command | `nx test mobile --watch` |
| Full suite command | `nx test mobile --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MOB-01 | Expo SDK 55 app with React Native 0.83 | smoke | `nx run mobile:build` (check compilation) | ❌ Wave 0 |
| MOB-02 | NativeWind styling | unit | `jest --testPathPattern=Button` | ❌ Wave 0 |
| MOB-03 | Expo Router navigation | e2e | `detox test --configuration ios.sim.debug` | ❌ Wave 0 (Detox setup) |
| MOB-04 | Expo Push notifications | manual | Physical device testing | — |
| MOB-05 | Shared data-access hooks | unit | `nx test shared-data-access --testPathPattern=useFinancialData` | ❌ Wave 0 |
| MOB-06 | Offline queue | integration | `jest --testPathPattern=OfflineQueue` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `nx test mobile --watch --testPathPattern=<modified-module>`
- **Per wave merge:** `nx test mobile --coverage && nx test shared-data-access --coverage`
- **Phase gate:** Full suite green before `/gsd:verify-work` including manual push notification testing

### Wave 0 Gaps

- [ ] `apps/mobile/jest.config.js` — Jest configuration for React Native testing
- [ ] `apps/mobile/src/__tests__/` — Test directory structure
- [ ] `apps/mobile/src/__tests__/components/Button.test.tsx` — Component test example
- [ ] `libs/shared-data-access/src/__tests__/hooks/` — Hook tests
- [ ] `apps/mobile/e2e/` — Detox E2E tests (optional, push notifications require manual testing)
- [ ] Framework install: `pnpm add -D @testing-library/react-native @testing-library/jest-native jest-expo` — Wave 0

*(Note: Push notification testing requires physical devices and Expo development build, cannot be fully automated in Wave 0)*

## Sources

### Primary (HIGH confidence)

- **Expo SDK 55** - Verified via npm registry (expo@55.0.8)
- **React Native 0.84.1** - Verified via npm registry (latest version)
- **NativeWind v4.2.3** - Verified via npm registry, official documentation https://nativewind.dev/
- **Expo Router v55.0.7** - Verified via npm registry, official documentation https://docs.expo.dev/router/introduction/
- **expo-notifications v55.0.13** - Verified via npm registry, official docs https://docs.expo.dev/versions/latest/sdk/notifications/
- **expo-sqlite v55.0.11** - Verified via npm registry
- **TanStack Query v5.95.2** - Verified via npm registry, matches web client version
- **@react-native-community/netinfo v12.0.1** - Verified via npm registry
- **@nx/expo plugin** - Verified available in npm registry

### Secondary (MEDIUM confidence)

- **Existing web client hooks** - Code review of `apps/web/src/hooks/use*.ts` patterns
- **API client patterns** - Code review of `apps/web/src/lib/api/financial.ts` and `api.ts`
- **Nx workspace structure** - Review of `nx.json` and existing monorepo setup
- **Shared data-access library** - Review of `libs/data-access/` existing structure

### Tertiary (LOW confidence)

- **Offline queue conflict resolution** - Industry patterns (last-write-wins with timestamps), needs validation during implementation
- **Push notification payload format** - Expo docs show custom data support, exact schema for deep linking TBD
- **EAS build configuration** - Documentation available but not verified for this specific project

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm registry, official documentation reviewed
- Architecture: HIGH - Expo Router and NativeWind patterns from official docs, shared data-access based on existing codebase patterns
- Pitfalls: HIGH - Common React Native issues documented in community, AsyncStorage security issue well-known
- Implementation details: MEDIUM - Token refresh strategy and conflict resolution UX require validation during implementation

**Research date:** 2026-03-24
**Valid until:** 2026-04-23 (30 days - Expo SDK versions stable, but rapid ecosystem updates possible)
