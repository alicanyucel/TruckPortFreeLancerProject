import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: string[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getBookingTrips().subscribe(trips => {
      const allCategories = trips.map(trip => trip.category).filter(Boolean);
      this.categories = Array.from(new Set(allCategories));
    });
  }
}
