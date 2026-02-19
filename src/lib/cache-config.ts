/**
 * Centralized cache timing config for React Query.
 *
 * STATIC   — categories, pages, blog categories (rarely change)
 * MODERATE — featured numbers, blog lists (change infrequently)
 * DYNAMIC  — stats, orders, user data (change often)
 * REALTIME — currently-editing data, no caching desired
 */

export const CACHE = {
  /** 30 min — ideal for categories, pages, blog categories */
  STATIC: 30 * 60 * 1000,

  /** 10 min — featured numbers, blog post listings */
  MODERATE: 10 * 60 * 1000,

  /** 2 min — phone number listings, user orders, favorites */
  DYNAMIC: 2 * 60 * 1000,

  /** 30 sec — admin stats, live data */
  SHORT: 30 * 1000,

  /** Keep in memory for 15 minutes */
  GC_TIME: 15 * 60 * 1000,
} as const;
