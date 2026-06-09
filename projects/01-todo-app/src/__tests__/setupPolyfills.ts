/**
 * Polyfills that run BEFORE the test environment is set up.
 * Loaded via Jest's `setupFiles` option.
 */

// structuredClone: required by fake-indexeddb v6.
// jsdom 20 doesn't expose it; polyfill with a JSON round-trip (fine for plain objects).
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
}
