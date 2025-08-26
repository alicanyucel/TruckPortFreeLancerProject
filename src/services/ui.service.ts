import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private roadAssistSubject = new Subject<void>();

  openRoadAssist(): void {
    this.roadAssistSubject.next();
  }

  onOpenRoadAssist(): Observable<void> {
    return this.roadAssistSubject.asObservable();
  }
}

