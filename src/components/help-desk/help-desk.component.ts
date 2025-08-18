import { Component } from '@angular/core';

@Component({
  selector: 'app-help-desk',
  templateUrl: './help-desk.component.html',
  styleUrls: ['./help-desk.component.css']
})
export class HelpDeskComponent {
menuItems = [
    { label: 'Gizlilik Politikası', icon: 'lock', route: '/privacy' },
    { label: 'Hakkımızda', icon: 'info', route: '/about' },
    { label: 'Şartlar ve Koşullar', icon: 'gavel', route: '/terms' },
    { label: 'Hesap Silme', icon: 'delete', route: '/delete-account' }
  ];
 onMenuClick(action: string) {
    console.log(`Clicked: ${action}`);
  }
}
