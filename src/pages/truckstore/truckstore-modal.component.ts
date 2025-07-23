import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-truckstore-modal',
  templateUrl: './truckstore-modal.component.html',
  styleUrls: ['./truckstore-modal.component.css']
})
export class TruckstoreModalComponent {
  @Input() truck: any;
  @Input() user: any;
}
