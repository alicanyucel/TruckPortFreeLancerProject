import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-uye-ol',
  template: `
    <div class="uyeol-card">
      <div class="uyeol-header">
        <svg width="48" height="48" fill="#2563eb" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
        <h2>{{ 'signup.title' | translate }}</h2>
        <p class="uyeol-subtitle">{{ 'signup.subtitle' | translate }}</p>
      </div>
      <form class="uyeol-form">
        <div class="uyeol-form-group input-with-icon">
          <label for="name">{{ 'signup.name' | translate }}</label>
          <div class="input-row">
            <i class="fa fa-user input-icon" aria-hidden="true"></i>
            <input type="text" id="name" name="name" required placeholder="{{ 'signup.namePlaceholder' | translate }}">
          </div>
        </div>
        <div class="uyeol-form-group input-with-icon">
          <label for="email">{{ 'signup.email' | translate }}</label>
          <div class="input-row">
            <i class="fa fa-envelope input-icon" aria-hidden="true"></i>
            <input type="email" id="email" name="email" required placeholder="{{ 'signup.emailPlaceholder' | translate }}">
          </div>
        </div>
        <div class="uyeol-form-group input-with-icon">
          <label for="password">{{ 'signup.password' | translate }}</label>
          <div class="input-row">
            <i class="fa fa-lock input-icon" aria-hidden="true"></i>
            <input type="password" id="password" name="password" required placeholder="{{ 'signup.passwordPlaceholder' | translate }}">
          </div>
        </div>
        <div class="privacy-group">
          <button type="button" class="privacy-btn" (click)="openPrivacyModal()">{{ 'signup.privacyBtn' | translate }}</button>
        </div>
        <button type="submit" class="uyeol-btn">{{ 'signup.submit' | translate }}</button>
      </form>
      <div class="uyeol-already-member">
        {{ 'signup.alreadyMember' | translate }}
        <a routerLink="/login" class="uyeol-login-link">{{ 'signup.loginLink' | translate }}</a>
      </div>
      <div *ngIf="showPrivacyModal" class="privacy-modal-overlay">
        <div class="privacy-modal">
          <div class="privacy-content">
            <h3>{{ 'signup.privacyTitle' | translate }}</h3>
            <p>{{ 'signup.privacyText' | translate }}</p>
          </div>
          <button class="close-btn" (click)="closePrivacyModal()">{{ 'common.close' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UyeOlComponent {
  privacyAccepted = false;
  showPrivacyModal = false;

  openPrivacyModal() {
    this.showPrivacyModal = true;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }
}
