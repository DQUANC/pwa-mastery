import '@testing-library/jest-dom';

// Polyfill structuredClone for older jsdom environments
// (fake-indexeddb v6 requires it for cloning stored values)
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
}

// Polyfill crypto.randomUUID for jsdom environments that don't have it
if (!globalThis.crypto.randomUUID) {
  let uuidCounter = 0;
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: () => {
      uuidCounter += 1;
      return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, '0')}`;
    },
    writable: true,
    configurable: true,
  });
}
