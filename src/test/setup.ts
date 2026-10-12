import '@testing-library/jest-dom';

const originalFetch = Object.getOwnPropertyDescriptor(globalThis, 'fetch');

beforeEach(() => {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: jest.fn(() => Promise.reject(new Error('Unexpected API request'))),
  });
});

afterEach(() => {
  if (originalFetch) {
    Object.defineProperty(globalThis, 'fetch', originalFetch);
  } else {
    Reflect.deleteProperty(globalThis, 'fetch');
  }
});
