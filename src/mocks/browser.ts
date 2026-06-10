// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { dbService } from './db-service';

// Expose the dbService to the window object so you can call window.dbService.purgeAndReset() in the browser console
const isDevelopment = process.env.NODE_ENV === 'development';
if (typeof window !== 'undefined' && isDevelopment) {
  (window as any).dbService = dbService;
}

export const worker = setupWorker(...handlers);