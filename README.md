
---
## 🇹🇷 Türkçe

# TruckPort

### Proje Hakkında
TruckPort, kamyon taşımacılığı ve yol destek hizmetleri için modern bir web uygulamasıdır. Senior seviye Angular mimarisi, NGRX state management, test coverage, CI/CD ve performans optimizasyonları ile geliştirilmiştir.

### Kurulum
1. Node.js (18+) ve npm kurulu olmalı.
2. Proje dizininde terminal açın:
   ```bash
   npm install
   ```

### Çalıştırma
```bash
npm start
```
Uygulama `http://localhost:4200` adresinde çalışır.

### Test
```bash
npm test
```
Tüm unit testler çalıştırılır.

### Build
```bash
npm run build
```
Üretim için derleme yapılır.

### Mimaride Öne Çıkanlar
- **Angular 16**
- **NGRX Store**: Global ve feature state yönetimi
- **Lazy Loading**: Modüller dinamik yüklenir
- **Unit Testler**: Reducer ve bileşen testleri
- **Performance Optimization**: OnPush, trackBy, async pipe
- **CI/CD**: GitHub Actions ile otomatik test ve build
- **Güvenlik**: Global error handler ve interceptor
- **Dokümantasyon**: Kod ve mimari açıklamaları

### Klasör Yapısı
- `src/app/` : Ana modül ve bileşenler
- `src/store/` : NGRX store, reducer, action, selector ve test dosyaları
- `src/pages/` : Sayfa bileşenleri
- `src/components/` : Ortak bileşenler
- `src/assets/` : Statik dosyalar


### Kod Standartları ve Katkı Rehberi
- Kodda TypeScript, Angular ve RxJS best practices uygulanır.
- Fonksiyonlar ve bileşenler küçük, tek sorumluluk ilkesine uygun olmalıdır.
- Her yeni özellik için unit test eklenmelidir.
- Katkı için: Fork, branch, pull request ve açıklama ekleyin.

### Katkı
Pull request ve issue açarak katkıda bulunabilirsiniz.
# TruckPort

## Code Standards & Contribution Guide
- TypeScript, Angular and RxJS best practices are applied.
- Functions and components should be small and follow single responsibility principle.
- Every new feature should include unit tests.
- For contributions: Fork, branch, pull request and description required.


### Güvenlik ve Erişilebilirlik
- Global hata yakalayıcı ve interceptor ile güvenlik önlemleri alınmıştır.
- Kullanıcı verileri gizlilik politikası ile korunur.
- Erişilebilirlik için: semantic HTML, ARIA etiketleri ve klavye navigasyonu desteklenir.
- XSS, CSRF gibi saldırılara karşı Angular'ın built-in koruma mekanizmaları kullanılır.

### Lisans
MIT
# TruckPort

## Security & Accessibility
- Global error handler and interceptor for security.
- User data is protected by privacy policy.
- Accessibility: semantic HTML, ARIA tags, keyboard navigation supported.
- Angular's built-in protections against XSS, CSRF, etc.

---
## 🇬🇧 English

# TruckPort

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
