import { Component } from '@angular/core';

@Component({
  selector: 'app-amp',
  template: `
    <div class="amp-banner">
      <span>AMP Modu Aktif</span>
    </div>
  `,
  styles: [`
    .amp-banner {
      background: #ffd600;
      color: #222;
      padding: 8px 16px;
      font-weight: bold;
      text-align: center;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 8px;
    }
  `]
})
export class AmpComponent {}
