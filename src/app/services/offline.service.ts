import { Injectable, signal } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Subject } from 'rxjs';

export interface OfflineRequest {
  id?: number;
  url: string;
  method: string;
  body: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private dbPromise: Promise<IDBPDatabase<any>>;
  public isOnline = signal<boolean>(navigator.onLine);
  public syncComplete = new Subject<void>();

  constructor() {
    this.dbPromise = openDB('kitchenbar-offline', 1, {
      upgrade(db) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      },
    });

    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  private updateOnlineStatus() {
    this.isOnline.set(navigator.onLine);
    if (navigator.onLine) {
      this.syncRequests();
    }
  }

  async addToQueue(url: string, method: string, body: any) {
    const db = await this.dbPromise;
    await db.add('requests', {
      url,
      method,
      body,
      timestamp: Date.now()
    });
    console.log('[Offline] Request queued:', url);
  }

  async syncRequests() {
    console.log('[Offline] Starting sync...');
    const db = await this.dbPromise;
    const requests = await db.getAll('requests');

    if (requests.length === 0) return;

    for (const req of requests) {
      try {
        console.log('[Offline] Replaying:', req.url);
        // We use fetch here to avoid circular dependency with HttpClient if we were to inject it
        // Or we can just use fetch for simplicity in sync
        const response = await fetch(req.url, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if needed, usually from localStorage
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(req.body)
        });

        if (response.ok) {
           await db.delete('requests', req.id);
        } else {
            console.error('[Offline] Sync failed for req:', req.id, response.statusText);
            // Optionally keep it or move to dead letter queue
        }
      } catch (err) {
        console.error('[Offline] Sync error:', err);
      }
    }
    this.syncComplete.next();
    console.log('[Offline] Sync complete');
  }
}
