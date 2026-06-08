// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { dbService } from './db-service';

// Expose the dbService to the window object so you can call window.dbService.purgeAndReset() in the browser console
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
}

export const worker = setupWorker(...handlers);