import { Component } from '@angular/core';

@Component({
  selector: 'app-help-desk',
  templateUrl: './help-desk.component.html',
  styleUrls: ['./help-desk.component.css']
})
export class HelpDeskComponent {
  goBack() {
    try { window.history.back(); } catch (e) { /* ignore */ }
  }
}
