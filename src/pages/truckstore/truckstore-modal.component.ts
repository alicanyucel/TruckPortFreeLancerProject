import { Component, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-truckstore-modal',
  templateUrl: './truckstore-modal.component.html',
  styleUrls: ['./truckstore-modal.component.css']
})
export class TruckstoreModalComponent {
  @Input() truck: any;
  @Input() user: any;
  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent) {
    if (event.target && (event.target as HTMLElement).classList.contains('custom-modal-overlay')) {
      this.close.emit();
    }
  }
}
