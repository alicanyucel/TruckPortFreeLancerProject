import { Component } from '@angular/core';

@Component({
  selector: 'app-google-map',
  template: `
    <div class="google-map-container">
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        style="border:0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.858073624234!2d32.85974131535444!3d39.93336397942509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f5e6b6e6b6b%3A0x6b6e6b6e6b6e6b6e!2sAnkara!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
        allowfullscreen
        aria-hidden="false"
        tabindex="0"></iframe>
    </div>
  `,
  styles: [`
    .google-map-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    iframe {
      display: block;
      border: none;
    }
  `]
})
export class GoogleMapComponent {}
