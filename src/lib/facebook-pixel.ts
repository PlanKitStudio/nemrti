/**
 * Facebook Pixel integration for Numrti
 * 
 * Usage:
 * 1. Set VITE_FB_PIXEL_ID in .env
 * 2. <FacebookPixel /> is rendered in App.tsx (auto-tracks PageView)
 * 3. Use fbq() helpers for custom events:
 *    - fbqTrackAddToCart(id, name, price)
 *    - fbqTrackPurchase(orderId, totalValue, items)
 *    - fbqTrackViewContent(id, name, price)
 *    - fbqTrackSearch(query)
 *    - fbqTrackLead()
 */

// Extend window type for fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: (...args: any[]) => void;
  }
}

const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '';

/**
 * Initialize Facebook Pixel script (called once on app load)
 */
export function initFacebookPixel(): void {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return;

  // Avoid double-init
  if (window.fbq) return;

  // Facebook Pixel base code
  const f = window;
  const b = document;
  const e = 'script';

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: string) {
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(f, b, e, 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
}

/**
 * Track a PageView event (called on route change)
 */
export function fbqTrackPageView(): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'PageView');
}

/**
 * Track ViewContent event (when user views a number detail page)
 */
export function fbqTrackViewContent(
  contentId: string,
  contentName: string,
  value: number
): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value: value,
    currency: 'EGP',
  });
}

/**
 * Track AddToCart event
 */
export function fbqTrackAddToCart(
  contentId: string,
  contentName: string,
  value: number
): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'AddToCart', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value: value,
    currency: 'EGP',
  });
}

/**
 * Track InitiateCheckout event
 */
export function fbqTrackInitiateCheckout(
  contentIds: string[],
  totalValue: number,
  numItems: number
): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    value: totalValue,
    currency: 'EGP',
    num_items: numItems,
  });
}

/**
 * Track Purchase event (on successful order)
 */
export function fbqTrackPurchase(
  contentIds: string[],
  totalValue: number,
  numItems: number
): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: totalValue,
    currency: 'EGP',
    num_items: numItems,
  });
}

/**
 * Track Search event
 */
export function fbqTrackSearch(searchQuery: string): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'Search', {
    search_string: searchQuery,
  });
}

/**
 * Track Lead event (contact form, newsletter signup)
 */
export function fbqTrackLead(): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'Lead');
}

/**
 * Track CompleteRegistration event
 */
export function fbqTrackRegistration(): void {
  if (!FB_PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'CompleteRegistration');
}
