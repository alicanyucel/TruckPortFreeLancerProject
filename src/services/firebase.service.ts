import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

const firebaseApp = initializeApp(environment.firebase);
const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Subjects for auth state and auth errors
const authStateSubject = new BehaviorSubject<any>(null);
const authErrorSubject = new BehaviorSubject<Error | null>(null);

// Try anonymous sign-in and report errors
try {
  signInAnonymously(auth).catch((err) => authErrorSubject.next(err));
} catch (e) {
  authErrorSubject.next(e as Error);
}

// Resolve auth state changes and populate subject
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

  // Expose observables so components can react to auth errors / state
  getAuthError$(): Observable<Error | null> {
    return authErrorSubject.asObservable();
  }

  getAuthState$(): Observable<any> {
    return authStateSubject.asObservable();
  }

  getBookingTrips(): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      authReady.then(() => {
        const bookingRef = ref(db, 'booking_trips');
        const off = onValue(bookingRef, snapshot => {
          const data = snapshot.val();
          subscriber.next(data ? Object.values(data) : []);
        }, error => subscriber.error(error));
        // when subscriber unsubscribes, detach listener
        subscriber.add(() => off());
      });
    });
  }

  getDataFromNode(node: string): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
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
}