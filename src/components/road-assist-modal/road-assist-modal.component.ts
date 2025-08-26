import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-road-assist-modal',
  templateUrl: './road-assist-modal.component.html',
  styleUrls: ['./road-assist-modal.component.css']
})
export class RoadAssistModalComponent implements OnInit, OnDestroy {
  show = false;
  private sub?: Subscription;

  constructor(private ui: UiService) {}

  ngOnInit(): void {
    this.sub = this.ui.onOpenRoadAssist().subscribe(() => this.open());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  open(): void {
    this.show = true;
  }

  close(): void {
    this.show = false;
  }

  selectService(service: string): void {
    this.close();
    // demo behavior - replace with real flow later
    alert('Seçilen hizmet: ' + service);
  }
}
