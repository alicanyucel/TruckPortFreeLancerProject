# TruckPort Tema Sistemi

Bu proje için 5 farklı tema oluşturulmuştur: Light (Açık), Dark (Koyu), Red (Kırmızı), Blue (Mavi) ve Green (Yeşil).

## Mevcut Temalar

### 1. Light Theme (Açık) - Varsayılan
- Beyaz arka plan
- Koyu metinler
- Mavi accent renkleri

### 2. Dark Theme (Koyu)
- Koyu arka plan
- Açık metinler
- Mavi accent renkleri

### 3. Red Theme (Kırmızı)
- Açık kırmızı tonları
- Kırmızı accent renkleri
- Beyaz arka plan

### 4. Blue Theme (Mavi)
- Açık mavi tonları
- Mavi accent renkleri
- Beyaz arka plan

### 5. Green Theme (Yeşil)
- Açık yeşil tonları
- Yeşil accent renkleri
- Beyaz arka plan

## Kullanım

### Theme Service

```typescript
import { ThemeService } from './services/theme.service';

constructor(private themeService: ThemeService) {}

// Tema değiştirme
this.themeService.setTheme('dark');

// Mevcut tema öğrenme
const currentTheme = this.themeService.getCurrentTheme();

// Tema değişikliklerini dinleme
this.themeService.currentTheme$.subscribe(theme => {
  console.log('Yeni tema:', theme);
});

// Tema değiştirme (sıralı)
this.themeService.toggleTheme();

// Dark mode kontrolü
const isDark = this.themeService.isDarkMode();
```

### Theme Switcher Component

Navbar'da zaten tema değiştirici bileşen eklenmiştir. Kullanıcılar dropdown menüden tema seçebilir.

### CSS'de Tema Değişkenlerini Kullanma

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
}

.my-button {
  background-color: var(--accent-color);
  color: white;
}

.my-button:hover {
  background-color: var(--accent-hover);
}
```

## Mevcut CSS Değişkenleri

### Arka Plan Renkleri
- `--bg-primary`: Ana arka plan
- `--bg-secondary`: İkincil arka plan
- `--bg-tertiary`: Üçüncül arka plan

### Metin Renkleri
- `--text-primary`: Ana metin rengi
- `--text-secondary`: İkincil metin rengi
- `--text-tertiary`: Üçüncül metin rengi

### Çerçeve Renkleri
- `--border-color`: Varsayılan çerçeve rengi
- `--border-hover`: Hover durumunda çerçeve rengi

### Accent Renkleri
- `--accent-color`: Ana accent rengi
- `--accent-hover`: Hover durumunda accent rengi

### Primary Renkleri (Her temada farklı)
- `--primary-50` to `--primary-900`: Tema renginin farklı tonları

## Yeni Tema Ekleme

1. `src/styles/design-system.css` dosyasında yeni tema sınıfı oluşturun:

```css
.theme-purple {
  --primary-500: #8b5cf6;
  --bg-primary: #ffffff;
  --bg-secondary: #faf5ff;
  /* diğer değişkenler... */
}
```

2. `src/services/theme.service.ts` dosyasında tema tipini güncelleyin:

```typescript
export type Theme = 'light' | 'dark' | 'red' | 'blue' | 'green' | 'purple';
```

3. Theme switcher bileşeninde yeni temayı ekleyin:

```typescript
themes: Array<{value: Theme, label: string, icon: string}> = [
  // mevcut temalar...
  { value: 'purple', label: 'Mor', icon: '🟣' }
];
```

## Local Storage

Seçilen tema otomatik olarak `localStorage`'da `truckport-theme` anahtarı ile saklanır ve sayfa yenilendiğinde geri yüklenir.

## Erişilebilirlik

- Tema değişikliklerinde animasyonlar dahil
- `prefers-reduced-motion` desteği
- Uygun kontrast oranları
- Klavye navigasyonu desteği

## Geliştirici Notları

- Tüm renkler CSS custom properties olarak tanımlanmıştır
- Temalar body elementine sınıf eklenerek değiştirilir
- Smooth transition'lar tüm bileşenlerde aktif
- Component'larda hard-coded renkler yerine tema değişkenleri kullanılmalıdır
