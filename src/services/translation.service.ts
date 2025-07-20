import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('tr');
  private translations: Translations = {
    // Navbar
    'navbar.home': { tr: 'Ana Sayfa', en: 'Home' },
    'navbar.services': { tr: 'Hizmetler', en: 'Services' },
    'navbar.about': { tr: 'Hakkımızda', en: 'About Us' },
    'navbar.contact': { tr: 'İletişim', en: 'Contact' },
    'navbar.liveTracking': { tr: 'Canlı Takip', en: 'Live Tracking' },
    'navbar.login': { tr: 'Giriş Yap', en: 'Login' },

    // Home Page
    'home.welcomeTitle': { tr: 'TruckPort\'a Hoş Geldiniz', en: 'Welcome to TruckPort' },
    'home.welcomeSubtitle': { tr: 'Lojistik ve Nakliye Hizmetlerinde Güvenilir Çözüm Ortağınız', en: 'Your Reliable Solution Partner in Logistics and Transportation Services' },
    'home.contactButton': { tr: 'Hemen İletişime Geçin', en: 'Contact Us Now' },
    'home.liveTrackingButton': { tr: '🗺️ Canlı Araç Takibi', en: '🗺️ Live Vehicle Tracking' },
    'home.servicesTitle': { tr: 'Hizmetlerimiz', en: 'Our Services' },
    'home.truckTransport': { tr: 'Kamyon Taşımacılığı', en: 'Truck Transportation' },
    'home.truckTransportDesc': { tr: 'Güvenli ve hızlı kamyon nakliye hizmetleri', en: 'Safe and fast truck transportation services' },
    'home.logisticSolutions': { tr: 'Lojistik Çözümleri', en: 'Logistics Solutions' },
    'home.logisticSolutionsDesc': { tr: 'Kapsamlı lojistik planlama ve yönetimi', en: 'Comprehensive logistics planning and management' },
    'home.storage': { tr: 'Depolama', en: 'Storage' },
    'home.storageDesc': { tr: 'Modern depolama ve stok yönetimi hizmetleri', en: 'Modern storage and inventory management services' },

    // Live Tracking
    'tracking.title': { tr: '🗺️ Canlı Araç Takibi', en: '🗺️ Live Vehicle Tracking' },
    'tracking.subtitle': { tr: 'Filomuzun gerçek zamanlı konumunu takip edin', en: 'Track our fleet\'s real-time location' },
    'tracking.vehicleList': { tr: 'Araç Listesi', en: 'Vehicle List' },
    'tracking.vehicleDetails': { tr: 'Araç Detayları', en: 'Vehicle Details' },
    'tracking.vehicleInfo': { tr: 'Araç Bilgileri', en: 'Vehicle Information' },
    'tracking.locationInfo': { tr: 'Konum Bilgileri', en: 'Location Information' },
    'tracking.cargoInfo': { tr: 'Yük Bilgileri', en: 'Cargo Information' },
    'tracking.status.active': { tr: 'Aktif', en: 'Active' },
    'tracking.status.idle': { tr: 'Beklemede', en: 'Idle' },
    'tracking.status.maintenance': { tr: 'Bakımda', en: 'Maintenance' },
    'tracking.driver': { tr: 'Sürücü', en: 'Driver' },
    'tracking.destination': { tr: 'Hedef', en: 'Destination' },
    'tracking.cargo': { tr: 'Yük', en: 'Cargo' },
    'tracking.speed': { tr: 'Hız', en: 'Speed' },
    'tracking.lastUpdate': { tr: 'Son Güncelleme', en: 'Last Update' },
    'tracking.latitude': { tr: 'Enlem', en: 'Latitude' },
    'tracking.longitude': { tr: 'Boylam', en: 'Longitude' },
    'tracking.statusIndicators': { tr: 'Durum Göstergeleri', en: 'Status Indicators' },

    // Services Page
    'services.title': { tr: 'Hizmetlerimiz', en: 'Our Services' },
    'services.subtitle': { tr: 'TruckPort olarak sunduğumuz profesyonel lojistik hizmetleri', en: 'Professional logistics services we provide as TruckPort' },
    'services.ctaTitle': { tr: 'Hizmetlerimiz Hakkında Daha Fazla Bilgi Almak İster Misiniz?', en: 'Would You Like to Learn More About Our Services?' },
    'services.ctaSubtitle': { tr: 'Uzman ekibimiz size en uygun çözümü sunmak için hazır.', en: 'Our expert team is ready to provide you with the most suitable solution.' },
    'services.contactButton': { tr: 'İletişime Geçin', en: 'Contact Us' },

    // About Page  
    'about.title': { tr: 'Hakkımızda', en: 'About Us' },
    'about.subtitle': { tr: 'TruckPort olarak, lojistik sektöründe güvenilir ve kaliteli hizmet sunma amacıyla yola çıktık.', en: 'As TruckPort, we set out to provide reliable and quality service in the logistics sector.' },
    'about.mission': { tr: 'Misyonumuz', en: 'Our Mission' },
    'about.vision': { tr: 'Vizyonumuz', en: 'Our Vision' },
    'about.values': { tr: 'Değerlerimiz', en: 'Our Values' },
    'about.statsTitle': { tr: 'Rakamlarla TruckPort', en: 'TruckPort in Numbers' },

    // Contact Page
    'contact.title': { tr: 'İletişim', en: 'Contact' },
    'contact.subtitle': { tr: 'Bizimle iletişime geçin, size en iyi hizmeti sunalım.', en: 'Contact us, let us provide you with the best service.' },
    'contact.info': { tr: 'İletişim Bilgileri', en: 'Contact Information' },
    'contact.form': { tr: 'Bize Ulaşın', en: 'Contact Us' },
    'contact.address': { tr: 'Adres', en: 'Address' },
    'contact.phone': { tr: 'Telefon', en: 'Phone' },
    'contact.mobile': { tr: 'Mobil', en: 'Mobile' },
    'contact.email': { tr: 'E-posta', en: 'Email' },
    'contact.workingHours': { tr: 'Çalışma Saatleri', en: 'Working Hours' },

    // Login Page
    'login.title': { tr: 'Giriş Yap', en: 'Login' },
    'login.subtitle': { tr: 'Hesabınıza giriş yapın', en: 'Login to your account' },
    'login.email': { tr: 'E-posta', en: 'Email' },
    'login.password': { tr: 'Şifre', en: 'Password' },
    'login.rememberMe': { tr: 'Beni hatırla', en: 'Remember me' },
    'login.forgotPassword': { tr: 'Şifremi unuttum', en: 'Forgot password' },
    'login.loginButton': { tr: 'Giriş Yap', en: 'Login' },
    'login.noAccount': { tr: 'Hesabınız yok mu?', en: 'Don\'t have an account?' },
    'login.register': { tr: 'Kayıt Ol', en: 'Register' },

    // Footer
    'footer.copyright': { tr: 'Copyright TruckPort - Her hakkı saklıdır.', en: 'Copyright TruckPort - All rights reserved.' },

    // Chatbot
    'chatbot.welcome': { tr: 'Merhaba! TruckPort müşteri destek chatbot\'uyum. Size nasıl yardımcı olabilirim?', en: 'Hello! I am TruckPort customer support chatbot. How can I help you?' },
    'chatbot.services': { tr: '🚛 Hizmetler', en: '🚛 Services' },
    'chatbot.pricing': { tr: '💰 Fiyat Teklifi', en: '💰 Price Quote' },
    'chatbot.contact': { tr: '📞 İletişim', en: '📞 Contact' },

    // Common
    'common.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
    'common.error': { tr: 'Hata', en: 'Error' },
    'common.success': { tr: 'Başarılı', en: 'Success' },
    'common.save': { tr: 'Kaydet', en: 'Save' },
    'common.cancel': { tr: 'İptal', en: 'Cancel' },
    'common.close': { tr: 'Kapat', en: 'Close' }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
      this.currentLanguage.next(savedLang);
    }
  }

  setLanguage(lang: string) {
    this.currentLanguage.next(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  getLanguage$() {
    return this.currentLanguage.asObservable();
  }

  translate(key: string): string {
    const currentLang = this.currentLanguage.value;
    if (this.translations[key] && this.translations[key][currentLang]) {
      return this.translations[key][currentLang];
    }
    return key; // Return key if translation not found
  }

  // Pipe için kullanılacak
  instant(key: string): string {
    return this.translate(key);
  }
}
