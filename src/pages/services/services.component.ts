
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  categories: string[] = [];
  showRoadAssistModal = false;

  private uiSub?: Subscription;
  constructor(private firebaseService: FirebaseService, private uiService: UiService) {}

  ngOnInit(): void {
    this.firebaseService.getBookingTrips().subscribe(trips => {
      const allCategories = trips.map(trip => trip.category).filter(Boolean);
      this.categories = Array.from(new Set(allCategories));
    });
  // listen for external UI requests to open the Road Assist modal
  this.uiSub = this.uiService.onOpenRoadAssist().subscribe(() => this.openRoadAssistModal());
  }

  onCategoryClick(category: string) {
    // Burada kategoriye özel işlem yapılabilir (örn. detay sayfasına yönlendirme)
    alert('Seçilen kategori: ' + category);
  }

  openRoadAssistModal() {
    this.showRoadAssistModal = true;
  }

  closeRoadAssistModal() {
    this.showRoadAssistModal = false;
  }

  onSelectService(service: string) {
    // Basit demo: kullanıcı seçimi alındıktan sonra modalı kapat ve bilgi göster
    this.closeRoadAssistModal();
    alert('Seçilen hizmet: ' + service);
  }

  ngOnDestroy(): void {
    if (this.uiSub) this.uiSub.unsubscribe();
  }
}
