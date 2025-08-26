import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, update, remove, child, get } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

export const firebaseApp = initializeApp(environment.firebase);
export const db = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);

const authStateSubject = new BehaviorSubject<any>(null);
const authErrorSubject = new BehaviorSubject<Error | null>(null);

try {
  signInAnonymously(auth).catch((err) => authErrorSubject.next(err));
} catch (e) {
  authErrorSubject.next(e as Error);
}

const authReady: Promise<void> = new Promise(resolve => {
  const unsub = onAuthStateChanged(auth, (user) => {
    authStateSubject.next(user);
    resolve();
    unsub();
  }, (err) => {
    authErrorSubject.next(err as Error);
    resolve();
    unsub();
  });
});

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor() {}

  getAuthError$(): Observable<Error | null> {
    return authErrorSubject.asObservable();
  }

  getAuthState$(): Observable<any> {
    return authStateSubject.asObservable();
  }

  getAll<T>(node: string): Observable<T[]> {
    return new Observable<T[]>(subscriber => {
      authReady.then(() => {
        const nodeRef = ref(db, node);
        const off = onValue(nodeRef, snapshot => {
          const data = snapshot.val();
          subscriber.next(data ? Object.values(data) : []);
        }, error => subscriber.error(error));
        subscriber.add(() => off());
      });
    });
  }

  getById<T>(node: string, id: string): Promise<T | null> {
    return authReady.then(async () => {
      const snap = await get(child(ref(db), `${node}/${id}`));
      return snap.exists() ? (snap.val() as T) : null;
    });
  }

  create<T>(node: string, data: T): Promise<string> {
    return authReady.then(async () => {
      const newRef = push(ref(db, node));
      await set(newRef, data);
      return newRef.key!;
    });
  }

  update<T>(node: string, id: string, data: T): Promise<void> {
    return authReady.then(() => set(ref(db, `${node}/${id}`), data));
  }

  patch(node: string, id: string, data: Partial<any>): Promise<void> {
    return authReady.then(() => update(ref(db, `${node}/${id}`), data));
  }

  delete(node: string, id: string): Promise<void> {
    return authReady.then(() => remove(ref(db, `${node}/${id}`)));
  }


  // Özel metodlar
  getBookingTrips(): Observable<any[]> {
    return this.getAll<any>('booking_trips'); 
  }

  getProviders(): Observable<any[]> {
    return this.getAll<any>('providers');
  }

  getDevices(): Observable<any[]> {
    return this.getAll<any>('devices');
  }
}
