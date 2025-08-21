import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private db: AngularFireDatabase) {}

  getProviders(): Observable<any[]> {
    return this.db.list('/providers').valueChanges();
  }
}
