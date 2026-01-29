import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';

/**
 * Data Fetching Utilities for Performance Optimization
 */

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 50; // Process items in batches

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
const dataCache = new DataCache();

/**
 * Optimized Supabase client with caching and batching
 */
export class OptimizedSupabaseClient {
  /**
   * Fetch with caching
   */
  static async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<{ data: T | null; error: any }>
  ): Promise<{ data: T | null; error: any }> {
    // Check cache first
    const cached = dataCache.get<T>(key);
    if (cached) {
      return { data: cached, error: null };
    }

    // Fetch fresh data
    const result = await fetcher();
    
    if (result.data && !result.error) {
      dataCache.set(key, result.data);
    }
    
    return result;
  }

  /**
   * Batch fetch multiple items
   */
  static async batchFetch<T>(
    items: Array<{ id: string; fetcher: () => Promise<T> }>,
    batchSize: number = BATCH_SIZE
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => item.fetcher())
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Optimized projects fetch with specific fields
   */
  static async fetchProjectsOptimized() {
    return supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        status,
        created_by,
        created_at,
        updated_at,
        team_members
      `)
      .order('created_at', { ascending: false });
  }

  /**
   * Optimized tasks fetch with joins
   */
  static async fetchTasksOptimized(projectId?: string) {
    let query = supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        assigned_to,
        project_id,
        created_by,
        created_at,
        updated_at,
        due_date,
        projects!inner (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    return query;
  }

  /**
   * Fetch user profile with role
   */
  static async fetchUserProfile(userId: string) {
    return supabase
      .from('users')
      .select('id, email, full_name, role, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();
  }

  /**
   * Prefetch related data
   */
  static async prefetchRelatedData(userId: string) {
    const cacheKey = `user_${userId}_related`;
    const cached = dataCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Prefetch user profile, projects, and tasks in parallel
    const [profile, projects, tasks] = await Promise.all([
      this.fetchUserProfile(userId),
      this.fetchProjectsOptimized(),
      this.fetchTasksOptimized()
    ]);

    const relatedData = {
      profile: profile.data,
      projects: projects.data,
      tasks: tasks.data
    };

    dataCache.set(cacheKey, relatedData);
    return relatedData;
  }
}

/**
 * React hook for optimized data fetching
 */
export const useOptimizedData = <T>(
  key: string,
  fetcher: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await OptimizedSupabaseClient.fetchWithCache(key, fetcher);
      
      setData(result.data);
      setError(result.error);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Debounced fetch hook for search/filter operations
 */
export const useDebouncedFetch = <T>(
  fetcher: (query: string) => Promise<{ data: T | null; error: any }>,
  delay: number = 300
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const result = await fetcher(query);
          setData(result.data);
          setError(result.error);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setData(null);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, fetcher, delay]);

  return { data, loading, error, query, setQuery };
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      this.metrics.get(name)!.push(duration);
      
      // Keep only last 100 measurements
      const measurements = this.metrics.get(name)!;
      if (measurements.length > 100) {
        measurements.shift();
      }
      
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    };
  }

  static getAverageTime(name: string): number {
    const measurements = this.metrics.get(name) || [];
    return measurements.length > 0 
      ? measurements.reduce((a, b) => a + b, 0) / measurements.length 
      : 0;
  }

  static getReport(): string {
    let report = '📊 Performance Report:\n';
    
    for (const [name, measurements] of this.metrics.entries()) {
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);
      
      report += `${name}: avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms (${measurements.length} samples)\n`;
    }
    
    return report;
  }

  static clear(): void {
    this.metrics.clear();
  }
}

export { dataCache };
