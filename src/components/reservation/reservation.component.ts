import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  reservations = [
    { id: '001', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '002', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '003', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' }
  ];
}

