/**
 * Odyssey Flow - Storage & Cache Architecture
 * 
 * DESIGN PRINCIPLE:
 * Abstract cache interface designed so localStorage can seamlessly be replaced
 * by Redis, Memcached, or an edge key-value store in production environments
 * without changing any application or service code.
 * 
 * Adheres strictly to hackathon specifications:
 * - Client-side prototype uses localStorage ONLY
 * - No Redis dependencies or connection requirements
 */

export interface CacheAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlSeconds?: number): void;
  remove(key: string): void;
  clear(): void;
  clearNamespace(prefix: string): void;
}

interface CacheEnvelope<T> {
  data: T;
  cachedAt: number;
  expiresAt?: number;
}

class LocalStorageCacheAdapter implements CacheAdapter {
  private prefix = 'odyssey_flow:';

  private fullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(this.fullKey(key));
      if (!item) return null;

      const envelope: CacheEnvelope<T> = JSON.parse(item);
      if (envelope.expiresAt && Date.now() > envelope.expiresAt) {
        this.remove(key);
        return null;
      }
      return envelope.data;
    } catch (e) {
      console.warn(`[Cache Error] Failed reading key "${key}":`, e);
      return null;
    }
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    if (typeof window === 'undefined') return;
    try {
      const envelope: CacheEnvelope<T> = {
        data: value,
        cachedAt: Date.now(),
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
      };
      localStorage.setItem(this.fullKey(key), JSON.stringify(envelope));
      this.notifySubscribers(key, value);
    } catch (e) {
      console.warn(`[Cache Error] Failed saving key "${key}":`, e);
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.fullKey(key));
      this.notifySubscribers(key, null);
    } catch (e) {
      console.warn(`[Cache Error] Failed removing key "${key}":`, e);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      this.notifySubscribers('*', null);
    } catch (e) {
      console.warn('[Cache Error] Failed clearing cache:', e);
    }
  }

  clearNamespace(subPrefix: string = ''): void {
    if (typeof window === 'undefined') return;
    try {
      const targetPrefix = `${this.prefix}${subPrefix}`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(targetPrefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[Cache Error] Failed clearing namespace:', e);
    }
  }

  // Reactive subscription mechanism for live UI updates
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      const set = this.listeners.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) this.listeners.delete(key);
      }
    };
  }

  private notifySubscribers(key: string, data: any) {
    const set = this.listeners.get(key);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error('[Cache Subscriber Error]', err);
        }
      });
    }
  }
}

// Singleton cache instance
export const cache = new LocalStorageCacheAdapter();

// Well-defined cache keys for the prototype
export const CACHE_KEYS = {
  // Required keys per specification:
  activePatient: 'activePatient',
  activeToken: 'activeToken',
  currentQueueSnapshot: 'currentQueueSnapshot',
  sanctuaryPulse: 'sanctuaryPulse',
  demoMode: 'demoMode',
  recentJourney: 'recentJourney',

  // Alias / internal cache keys:
  CURRENT_PATIENT_SESSION: 'activePatient',
  ACTIVE_TOKEN: 'activeToken',
  CACHED_QUEUE: 'currentQueueSnapshot',
  SANCTUARY_PULSE: 'sanctuaryPulse',
  DEMO_MODE_STATE: 'demoMode',
  RECENT_JOURNEY: 'recentJourney',

  DOCTORS_STATE: 'clinic:doctors:roster',
  CLINICS_LIST: 'clinic:directory:list',
  PATIENT_RECORDS: 'clinical:patients:all',
  DPS_SNAPSHOTS: 'clinical:dps:snapshots',
  DIAGNOSTIC_EVENTS: 'clinical:diagnostic:events',
  BILLING_RECORDS: 'clinic:billing:records',
  AUDIT_LOGS: 'system:audit:logs',
  SIMULATION_STATE: 'patient:simulation:live',
  VISIT_RECORDS: 'clinical:visits:all',
  REFERRAL_RECORDS: 'clinical:referrals:all',
  CLINIC_SETTINGS: 'clinic:settings:config',
  QUEUE_PAUSED: 'clinic:queue:paused',
} as const;
