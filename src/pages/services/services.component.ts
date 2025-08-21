
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  categories: string[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getBookingTrips().subscribe(trips => {
      const allCategories = trips.map(trip => trip.category).filter(Boolean);
      this.categories = Array.from(new Set(allCategories));
    });
  }

  onCategoryClick(category: string) {
    // Burada kategoriye özel işlem yapılabilir (örn. detay sayfasına yönlendirme)
    alert('Seçilen kategori: ' + category);
  }
}
