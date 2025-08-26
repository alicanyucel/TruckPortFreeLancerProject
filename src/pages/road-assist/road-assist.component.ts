import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-road-assist',
  templateUrl: './road-assist.component.html',
  styleUrls: ['./road-assist.component.css']
})
export class RoadAssistComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/hizmetler']);
  }

  selectService(service: string) {
    // Simple demo behavior: navigate back to services and show selection
    alert('Seçilen hizmet: ' + service);
    this.router.navigate(['/hizmetler']);
  }
}
