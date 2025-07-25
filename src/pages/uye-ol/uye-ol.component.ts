import { Component } from '@angular/core';

@Component({
  selector: 'app-uye-ol',
  template: `
    <div class="uyeol-card">
      <div class="uyeol-header">
        <svg width="48" height="48" fill="#2563eb" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
        <h2>Üye Ol</h2>
        <p class="uyeol-subtitle">TruckPort'a katıl, avantajlardan faydalan!</p>
      </div>
      <form class="uyeol-form">
        <div class="uyeol-form-group">
          <label for="name">Ad Soyad</label>
          <input type="text" id="name" name="name" required placeholder="Adınızı ve soyadınızı girin">
        </div>
        <div class="uyeol-form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="Email adresiniz">
        </div>
        <div class="uyeol-form-group">
          <label for="password">Şifre</label>
          <input type="password" id="password" name="password" required placeholder="Şifreniz">
        </div>
        <button type="submit" class="uyeol-btn">Üye Ol</button>
      </form>
      <div class="uyeol-already-member">
        <span>Zaten üyeyseniz <a routerLink="/giris" class="uyeol-login-link">giriş yapın</a>.</span>
      </div>
    </div>
  `,
  styles: [`
    .uyeol-already-member {
      margin-top: 24px;
      text-align: center;
      font-size: 1.08rem;
      color: #475569;
    }
    .uyeol-login-link {
      color: #2563eb;
      font-weight: 700;
      text-decoration: underline;
      margin-left: 4px;
      transition: color 0.18s;
    }
    .uyeol-login-link:hover {
      color: #1e40af;
    }
    .uyeol-card {
      max-width: 420px;
      margin: 48px auto;
      background: linear-gradient(120deg, #f8fafc 60%, #e3e8ef 100%);
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10);
      padding: 38px 32px 32px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .uyeol-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }
    .uyeol-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
      margin: 0;
    }
    .uyeol-subtitle {
      color: #475569;
      font-size: 1.08rem;
      margin: 0;
      opacity: 0.85;
    }
    .uyeol-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .uyeol-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      padding: 14px 12px 10px 12px;
    }
    label {
      font-weight: 600;
      color: #2563eb;
      font-size: 1rem;
    }
    input {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      font-size: 1.08rem;
      background: #f8fafc;
      transition: border 0.18s;
    }
    input:focus {
      border-color: #2563eb;
      outline: none;
      background: #fff;
    }
    .uyeol-btn {
      background: linear-gradient(90deg, #2563eb 60%, #1e40af 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 0;
      font-size: 1.15rem;
      font-weight: 700;
      margin-top: 10px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(37,99,235,0.08);
      transition: background 0.18s;
    }
    .uyeol-btn:hover {
      background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
    }
  `]
})
export class UyeOlComponent {}
