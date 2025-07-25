import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `<div class="profile-page"><h2>Profil Sayfası (Lazy Loaded)</h2></div>`,
  styles: [`
    .profile-page { padding: 32px; text-align: center; font-size: 1.5rem; color: #2563eb; }
  `]
})
export class ProfileComponent {}
