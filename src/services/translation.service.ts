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
    'navbar.transportRequests': { tr: 'Nakliye Talepleri', en: 'Transport Requests' },
    'navbar.truckStore': { tr: 'TruckStore', en: 'TruckStore' },
    'navbar.truckPortLounge': { tr: 'TruckPort Lounge', en: 'TruckPort Lounge' },
    'navbar.videoGallery': { tr: 'Video Galeri', en: 'Video Gallery' },
    'navbar.login': { tr: 'Giriş Yap', en: 'Login' },
    'navbar.logout': { tr: 'Çıkış Yap', en: 'Logout' },
    'navbar.welcome': { tr: 'Hoş geldin', en: 'Welcome' },

    // Home Page
    'home.welcomeTitle': { tr: 'TruckPort\'a Hoş Geldiniz', en: 'Welcome to TruckPort' },
    'home.welcomeSubtitle': { tr: 'Lojistik ve Nakliye Hizmetlerinde Güvenilir Çözüm Ortağınız', en: 'Your Reliable Solution Partner in Logistics and Transportation Services' },
    'home.contactButton': { tr: 'Hemen İletişime Geçin', en: 'Contact Us Now' },
    'home.liveTrackingButton': { tr: '🗺️ Canlı Araç Takibi', en: '🗺️ Live Vehicle Tracking' },
    'home.hero.transportRequests': { tr: '📋 Nakliye Talepleri', en: '📋 Transport Requests' },
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

    // Services - Trucking
    'services.trucking.title': { tr: 'Kamyon Taşımacılığı', en: 'Truck Transportation' },
    'services.trucking.description': { tr: 'Modern kamyon filomuzla güvenli ve hızlı nakliye hizmetleri sunuyoruz. Tüm Türkiye\'ye kapsamlı taşımacılık çözümleri.', en: 'We provide safe and fast transportation services with our modern truck fleet. Comprehensive transportation solutions across Turkey.' },
    'services.trucking.intercity': { tr: 'Şehirlerarası nakliye', en: 'Intercity transportation' },
    'services.trucking.heavyLoad': { tr: 'Ağır yük taşımacılığı', en: 'Heavy load transportation' },
    'services.trucking.coldChain': { tr: 'Soğuk zincir taşımacılığı', en: 'Cold chain transportation' },
    'services.trucking.hazardous': { tr: 'Tehlikeli madde taşımacılığı', en: 'Hazardous material transportation' },

    // Services - Logistics
    'services.logistics.title': { tr: 'Lojistik Çözümleri', en: 'Logistics Solutions' },
    'services.logistics.description': { tr: 'Entegre lojistik hizmetleriyle tedarik zincirinizi optimize ediyoruz. Planlama, koordinasyon ve takip hizmetleri.', en: 'We optimize your supply chain with integrated logistics services. Planning, coordination and tracking services.' },
    'services.logistics.supplyChain': { tr: 'Tedarik zinciri yönetimi', en: 'Supply chain management' },
    'services.logistics.routeOptimization': { tr: 'Rota optimizasyonu', en: 'Route optimization' },
    'services.logistics.stockManagement': { tr: 'Stok yönetimi', en: 'Stock management' },
    'services.logistics.distributionPlanning': { tr: 'Dağıtım planlama', en: 'Distribution planning' },

    // Services - Storage
    'services.storage.title': { tr: 'Depolama Hizmetleri', en: 'Storage Services' },
    'services.storage.description': { tr: 'Modern depo sistemlerimizde mallarınızı güvenle saklıyor, stok yönetimi ve sevkiyat hizmetleri sunuyoruz.', en: 'We safely store your goods in our modern warehouse systems and provide inventory management and shipping services.' },
    'services.storage.general': { tr: 'Genel depolama', en: 'General storage' },
    'services.storage.coldStorage': { tr: 'Soğuk hava depoları', en: 'Cold storage facilities' },
    'services.storage.bonded': { tr: 'Bonded depo', en: 'Bonded warehouse' },
    'services.storage.crossDocking': { tr: 'Cross-docking', en: 'Cross-docking' },

    // Services - International
    'services.international.title': { tr: 'Uluslararası Taşımacılık', en: 'International Transportation' },
    'services.international.description': { tr: 'Avrupa ve Orta Asya ülkelerine uluslararası nakliye hizmetleri. Gümrük işlemleri ve evrak takibi dahil.', en: 'International transportation services to European and Central Asian countries. Including customs procedures and document tracking.' },
    'services.international.europe': { tr: 'Avrupa taşımacılığı', en: 'European transportation' },
    'services.international.centralAsia': { tr: 'Orta Asya koridoru', en: 'Central Asia corridor' },
    'services.international.customs': { tr: 'Gümrük işlemleri', en: 'Customs procedures' },
    'services.international.tracking': { tr: 'Kargo takibi', en: 'Cargo tracking' },

    // Services - Express
    'services.express.title': { tr: 'Ekspres Teslimat', en: 'Express Delivery' },
    'services.express.description': { tr: 'Acil ihtiyaçlarınız için hızlı teslimat hizmetleri. Aynı gün ve ertesi gün teslimat seçenekleri mevcuttur.', en: 'Fast delivery services for your urgent needs. Same-day and next-day delivery options are available.' },
    'services.express.sameDay': { tr: 'Aynı gün teslimat', en: 'Same-day delivery' },
    'services.express.nextDay': { tr: 'Ertesi gün teslimat', en: 'Next-day delivery' },
    'services.express.sensitive': { tr: 'Hassas ürün taşımacılığı', en: 'Sensitive product transportation' },
    'services.express.dedicated': { tr: 'Özel araç tahsisi', en: 'Dedicated vehicle allocation' },

    // Services - Technology
    'services.technology.title': { tr: 'Teknoloji Çözümleri', en: 'Technology Solutions' },
    'services.technology.description': { tr: 'Dijital platformumuzla kargo takibi, fiyat hesaplama ve sevkiyat yönetimi kolaylaşıyor.', en: 'Cargo tracking, price calculation and shipment management become easier with our digital platform.' },
    'services.technology.onlineTracking': { tr: 'Online kargo takibi', en: 'Online cargo tracking' },
    'services.technology.priceCalculation': { tr: 'Fiyat hesaplama', en: 'Price calculation' },
    'services.technology.digitalDocs': { tr: 'Dijital evrak yönetimi', en: 'Digital document management' },
    'services.technology.mobileApp': { tr: 'Mobil uygulama', en: 'Mobile application' },

    // Transport Requests (formerly Live Map)
    'liveMap.title': { tr: 'Nakliye Talepleri', en: 'Transport Requests' },
    'liveMap.subtitle': { tr: 'Nakliye taleplerini görüntüleyin ve yönetin', en: 'View and manage transport requests' },
    'liveMap.statusIndicators': { tr: 'Durum Göstergeleri', en: 'Status Indicators' },
    'liveMap.status.active': { tr: 'Aktif', en: 'Active' },
    'liveMap.status.idle': { tr: 'Beklemede', en: 'Idle' },
    'liveMap.status.maintenance': { tr: 'Bakımda', en: 'Maintenance' },
    'liveMap.status.unknown': { tr: 'Bilinmiyor', en: 'Unknown' },
  'liveMap.reservationNo': { tr: 'Rezervasyon No', en: 'Reservation No' },
  'liveMap.whatsapp': { tr: 'Whatsapp', en: 'WhatsApp' },
  'liveMap.call': { tr: 'ARA', en: 'CALL' },
  'liveMap.imageAlt.vehicle': { tr: 'Araç resmi', en: 'Vehicle image' },
  'liveMap.imageAlt.user': { tr: 'Kullanıcı', en: 'User' },
  'liveMap.vehicleType': { tr: 'Araç Tipi', en: 'Vehicle Type' },
  'liveMap.date': { tr: 'Tarih', en: 'Date' },
  'liveMap.loadingAddress': { tr: 'Yükleme Adresi', en: 'Loading Address' },
  'liveMap.deliveryAddress': { tr: 'Teslimat Adresi', en: 'Delivery Address' },
  'liveMap.distance': { tr: 'Mesafe', en: 'Distance' },
    'liveMap.vehicleList': { tr: 'Araç Listesi', en: 'Vehicle List' },
    'liveMap.vehicleDetails': { tr: 'Araç Detayları', en: 'Vehicle Details' },
    'liveMap.details.vehicleInfo': { tr: 'Araç Bilgileri', en: 'Vehicle Information' },
    'liveMap.details.model': { tr: 'Model', en: 'Model' },
    'liveMap.details.driver': { tr: 'Sürücü', en: 'Driver' },
    'liveMap.details.status': { tr: 'Durum', en: 'Status' },
    'liveMap.details.locationInfo': { tr: 'Konum Bilgileri', en: 'Location Information' },
    'liveMap.details.latitude': { tr: 'Enlem', en: 'Latitude' },
    'liveMap.details.longitude': { tr: 'Boylam', en: 'Longitude' },
    'liveMap.details.speed': { tr: 'Hız', en: 'Speed' },
    'liveMap.details.lastUpdate': { tr: 'Son Güncelleme', en: 'Last Update' },
    'liveMap.details.cargoInfo': { tr: 'Yük Bilgileri', en: 'Cargo Information' },
    'liveMap.details.destination': { tr: 'Hedef', en: 'Destination' },
    'liveMap.details.cargo': { tr: 'Yük', en: 'Cargo' },

  // Signup Page
  'signup.title': { tr: 'Kayıt Ol', en: 'Sign Up' },
  'signup.subtitle': { tr: 'Başlamak için hesabınızı oluşturun.', en: 'Create your account to get started.' },
  'signup.name': { tr: 'Ad Soyad', en: 'Name' },
  'signup.namePlaceholder': { tr: 'Adınızı girin', en: 'Enter your name' },
  'signup.email': { tr: 'E-posta', en: 'Email' },
  'signup.emailPlaceholder': { tr: 'E-posta adresinizi girin', en: 'Enter your email address' },
  'signup.password': { tr: 'Şifre', en: 'Password' },
  'signup.passwordPlaceholder': { tr: 'Şifrenizi girin', en: 'Enter your password' },
  'signup.privacyBtn': { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
  'signup.submit': { tr: 'Kayıt Ol', en: 'Register' },
  'signup.alreadyMember': { tr: 'Zaten hesabınız var mı?', en: 'Already have an account?' },
  'signup.loginLink': { tr: 'Giriş Yap', en: 'Log In' },
  'signup.privacyTitle': { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
  'signup.privacyText': { tr: 'Bilgileriniz korunur ve paylaşılmaz.', en: 'Your information is protected and will not be shared.' },
  'signup.success': { tr: 'Kayıt başarılı!', en: 'Registration successful!' },
  'common.close': { tr: 'Kapat', en: 'Close' },
  // Vehicle Data Translations
    'vehicles.drivers.ahmet': { tr: 'Ahmet Yılmaz', en: 'Ahmet Yılmaz' },
    'vehicles.drivers.mehmet': { tr: 'Mehmet Kaya', en: 'Mehmet Kaya' },
    'vehicles.drivers.ali': { tr: 'Ali Demir', en: 'Ali Demir' },
    'vehicles.drivers.osman': { tr: 'Osman Şahin', en: 'Osman Şahin' },
    'vehicles.drivers.hasan': { tr: 'Hasan Özkan', en: 'Hasan Özkan' },
    
    'vehicles.destinations.ankara': { tr: 'Ankara', en: 'Ankara' },
    'vehicles.destinations.izmir': { tr: 'İzmir', en: 'Izmir' },
    'vehicles.destinations.bursa': { tr: 'Bursa', en: 'Bursa' },
    'vehicles.destinations.adana': { tr: 'Adana', en: 'Adana' },
    'vehicles.destinations.antalya': { tr: 'Antalya', en: 'Antalya' },
    
    'vehicles.cargo.electronics': { tr: 'Elektronik Eşya', en: 'Electronic Goods' },
    'vehicles.cargo.food': { tr: 'Gıda Ürünleri', en: 'Food Products' },
    'vehicles.cargo.textile': { tr: 'Tekstil Ürünleri', en: 'Textile Products' },
    'vehicles.cargo.construction': { tr: 'İnşaat Malzemesi', en: 'Construction Materials' },
    'vehicles.cargo.empty': { tr: 'Boş', en: 'Empty' },

    // Chatbot specific translations
    'chatbot.title': { tr: 'TruckPort Destek', en: 'TruckPort Support' },
    'chatbot.online': { tr: 'Çevrimiçi', en: 'Online' },
    'chatbot.placeholder': { tr: 'Mesajınızı yazın...', en: 'Type your message...' },
    'chatbot.quick.services': { tr: 'Hizmetler', en: 'Services' },
    'chatbot.quick.quote': { tr: 'Fiyat Teklifi', en: 'Price Quote' },
    'chatbot.quick.contact': { tr: 'İletişim', en: 'Contact' },
    'chatbot.quickMessages.services': { tr: 'Hizmetleriniz nelerdir?', en: 'What are your services?' },
    'chatbot.quickMessages.quote': { tr: 'Fiyat teklifi istiyorum', en: 'I want a price quote' },
    'chatbot.quickMessages.contact': { tr: 'İletişim bilgileri', en: 'Contact information' },

    // Chatbot Responses
    'chatbot.responses.welcome': { tr: 'Merhaba! TruckPort müşteri destek chatbot\'uyum. Size nasıl yardımcı olabilirim? 🤖', en: 'Hello! I am TruckPort customer support chatbot. How can I help you? 🤖' },
    'chatbot.responses.services': { tr: 'TruckPort olarak kamyon taşımacılığı, lojistik çözümleri, depolama ve uluslararası nakliye hizmetleri sunuyoruz. Hangi hizmetimiz hakkında bilgi almak istersiniz?', en: 'As TruckPort, we provide truck transportation, logistics solutions, storage and international shipping services. Which service would you like to know about?' },
    'chatbot.responses.price': { tr: 'Fiyat teklifimiz için lütfen İletişim sayfamızdan bizimle iletişime geçin. Size özel teklifimizi hazırlayalım! 💰', en: 'For our price quote, please contact us through our Contact page. Let us prepare a special offer for you! 💰' },
    'chatbot.responses.tracking': { tr: 'Canlı Takip sayfamızdan araçlarımızın gerçek zamanlı konumunu takip edebilirsiniz. 📍', en: 'You can track the real-time location of our vehicles from our Live Tracking page. 📍' },
    'chatbot.responses.contact': { tr: 'İletişim bilgilerimiz: 📞 +90 (212) 123 45 67 | 📧 info@truckport.com | 📍 İstanbul/Türkiye', en: 'Our contact information: 📞 +90 (212) 123 45 67 | 📧 info@truckport.com | 📍 Istanbul/Turkey' },
    'chatbot.responses.thanks': { tr: 'Rica ederim! Başka bir sorunuz varsa çekinmeden sorun. İyi günler! 😊', en: 'You\'re welcome! If you have any other questions, feel free to ask. Have a great day! 😊' },
    'chatbot.responses.default': { tr: 'Üzgünüm, bu konuda size yardımcı olamıyorum. Daha detaylı bilgi için İletişim sayfamızdan bizimle iletişime geçebilirsiniz. 📞', en: 'Sorry, I can\'t help you with that. For more detailed information, you can contact us through our Contact page. 📞' },

    // Additional contact form translations
    'contact.info.title': { tr: 'İletişim Bilgileri', en: 'Contact Information' },
    'contact.info.address.title': { tr: 'Adres', en: 'Address' },
    'contact.info.address.text': { tr: 'Örnek Mahallesi, Lojistik Caddesi No:123<br>34000 İstanbul/Türkiye', en: 'Sample District, Logistics Street No:123<br>34000 Istanbul/Turkey' },
    'contact.info.phone.title': { tr: 'Telefon', en: 'Phone' },
    'contact.info.mobile.title': { tr: 'Mobil', en: 'Mobile' },
    'contact.info.email.title': { tr: 'E-posta', en: 'Email' },
    'contact.info.hours.title': { tr: 'Çalışma Saatleri', en: 'Working Hours' },
    'contact.info.hours.text': { tr: 'Pazartesi - Cuma: 08:00 - 18:00<br>Cumartesi: 09:00 - 15:00', en: 'Monday - Friday: 08:00 - 18:00<br>Saturday: 09:00 - 15:00' },
    'contact.form.title': { tr: 'Bize Ulaşın', en: 'Contact Us' },
    'contact.form.name': { tr: 'Ad Soyad', en: 'Full Name' },
    'contact.form.email': { tr: 'E-posta', en: 'Email' },
    'contact.form.phone': { tr: 'Telefon', en: 'Phone' },
    'contact.form.subject': { tr: 'Konu', en: 'Subject' },
    'contact.form.selectSubject': { tr: 'Konu Seçiniz', en: 'Select Subject' },
    'contact.form.subjects.general': { tr: 'Genel Bilgi', en: 'General Information' },
    'contact.form.subjects.quote': { tr: 'Fiyat Teklifi', en: 'Price Quote' },
    'contact.form.subjects.support': { tr: 'Destek', en: 'Support' },
    'contact.form.subjects.complaint': { tr: 'Şikayet', en: 'Complaint' },
    'contact.form.message': { tr: 'Mesaj', en: 'Message' },
    'contact.form.submit': { tr: 'Mesaj Gönder', en: 'Send Message' },

    // Additional login translations
    'login.emailPlaceholder': { tr: 'E-posta adresinizi girin', en: 'Enter your email address' },
    'login.passwordPlaceholder': { tr: 'Şifrenizi girin', en: 'Enter your password' },

    // Additional home page translations
    'home.hero.title': { tr: 'TruckPort\'a Hoş Geldiniz', en: 'Welcome to TruckPort' },
    'home.hero.subtitle': { tr: 'Lojistik ve Nakliye Hizmetlerinde Güvenilir Çözüm Ortağınız', en: 'Your Reliable Solution Partner in Logistics and Transportation Services' },
    'home.hero.contact': { tr: 'Hemen İletişime Geçin', en: 'Contact Us Now' },
    'home.hero.liveTracking': { tr: '🗺️ Canlı Araç Takibi', en: '🗺️ Live Vehicle Tracking' },
    'home.services.title': { tr: 'Hizmetlerimiz', en: 'Our Services' },
    'home.services.trucking': { tr: 'Kamyon Taşımacılığı', en: 'Truck Transportation' },
    'home.services.truckingDesc': { tr: 'Güvenli ve hızlı kamyon nakliye hizmetleri', en: 'Safe and fast truck transportation services' },
    'home.services.logistics': { tr: 'Lojistik Çözümleri', en: 'Logistics Solutions' },
    'home.services.logisticsDesc': { tr: 'Kapsamlı lojistik planlama ve yönetimi', en: 'Comprehensive logistics planning and management' },
    'home.services.storage': { tr: 'Depolama', en: 'Storage' },
    'home.services.storageDesc': { tr: 'Modern depolama ve stok yönetimi hizmetleri', en: 'Modern storage and inventory management services' },

    // Additional about page translations
    'about.heroText': { tr: 'TruckPort olarak, lojistik sektöründe güvenilir ve kaliteli hizmet sunma amacıyla yola çıktık.', en: 'As TruckPort, we set out to provide reliable and quality service in the logistics sector.' },
    'about.mission.title': { tr: 'Misyonumuz', en: 'Our Mission' },
    'about.mission.text': { tr: 'Müşterilerimizin lojistik ihtiyaçlarını en kaliteli şekilde karşılayarak, güvenilir ve sürdürülebilir nakliye çözümleri sunmak.', en: 'To provide reliable and sustainable transportation solutions by meeting our customers\' logistics needs in the highest quality.' },
    'about.vision.title': { tr: 'Vizyonumuz', en: 'Our Vision' },
    'about.vision.text': { tr: 'Türkiye\'nin önde gelen lojistik firması olmak ve sektörde yenilikçi yaklaşımlarla standartları belirlemek.', en: 'To become Turkey\'s leading logistics company and set standards in the industry with innovative approaches.' },
    'about.values.title': { tr: 'Değerlerimiz', en: 'Our Values' },
    'about.values.reliability': { tr: 'Güvenilirlik', en: 'Reliability' },
    'about.values.quality': { tr: 'Kalite', en: 'Quality' },
    'about.values.satisfaction': { tr: 'Müşteri Memnuniyeti', en: 'Customer Satisfaction' },
    'about.values.innovation': { tr: 'Yenilikçilik', en: 'Innovation' },
    'about.values.sustainability': { tr: 'Sürdürülebilirlik', en: 'Sustainability' },
    'about.stats.title': { tr: 'Rakamlarla TruckPort', en: 'TruckPort in Numbers' },
    'about.stats.customers': { tr: 'Mutlu Müşteri', en: 'Happy Customers' },
    'about.stats.experience': { tr: 'Yıllık Deneyim', en: 'Years of Experience' },
    'about.stats.deliveries': { tr: 'Başarılı Teslimat', en: 'Successful Deliveries' },
    'about.stats.fleet': { tr: 'Araç Filosu', en: 'Vehicle Fleet' },

    // About Page  
    'about.title': { tr: 'Hakkımızda', en: 'About Us' },
    'about.subtitle': { tr: 'TruckPort olarak, lojistik sektöründe güvenilir ve kaliteli hizmet sunma amacıyla yola çıktık.', en: 'As TruckPort, we set out to provide reliable and quality service in the logistics sector.' },
    'about.mission': { tr: 'Misyonumuz', en: 'Our Mission' },
    'about.vision': { tr: 'Vizyonumuz', en: 'Our Vision' },
    'about.values': { tr: 'Değerlerimiz', en: 'Our Values' },
    'about.statsTitle': { tr: 'Rakamlarla TruckPort', en: 'TruckPort in Numbers' },

    // Contact Page
    'contact.title': { tr: 'İletişim', en: 'Contact' },
    'contact.heroText': { tr: 'Bizimle iletişime geçin, size en iyi hizmeti sunalım.', en: 'Contact us, let us provide you with the best service.' },

    // TruckStore Page
    'truckstore.title': { tr: 'TruckStore', en: 'TruckStore' },
    'truckstore.subtitle': { tr: 'Kamyon ve ticari araç alım satım platformu', en: 'Truck and commercial vehicle trading platform' },
    'truckstore.feature1.title': { tr: 'Geniş Araç Yelpazesi', en: 'Wide Vehicle Range' },
    'truckstore.feature1.description': { tr: 'Kamyonlar, çekiciler, yarı römorklar ve ticari araçların geniş koleksiyonu', en: 'Extensive collection of trucks, tractors, semi-trailers and commercial vehicles' },
    'truckstore.feature2.title': { tr: 'Güvenli Alım Satım', en: 'Secure Trading' },
    'truckstore.feature2.description': { tr: 'Doğrulanmış satıcılar ve güvenli ödeme sistemi ile güvenli işlemler', en: 'Secure transactions with verified sellers and safe payment system' },
    'truckstore.feature3.title': { tr: 'Detaylı Araç Bilgileri', en: 'Detailed Vehicle Information' },
    'truckstore.feature3.description': { tr: 'Her araç için kapsamlı teknik özellikler, fotoğraflar ve geçmiş bilgileri', en: 'Comprehensive technical specifications, photos and history for each vehicle' },
    'truckstore.cta.title': { tr: 'TruckStore\'u Keşfedin', en: 'Explore TruckStore' },
    'truckstore.cta.description': { tr: 'Binlerce kamyon ve ticari araç arasından ihtiyacınıza uygun olanı bulun. Profesyonel satıcılarımızla güvenle işlem yapın.', en: 'Find the right one for your needs among thousands of trucks and commercial vehicles. Trade safely with our professional sellers.' },
    'truckstore.openNewTab': { tr: 'TruckStore\'u Ziyaret Et', en: 'Visit TruckStore' },
  'navbar.loginPrompt': { tr: 'Hesabınıza giriş yaparak hizmetlerden faydalanabilirsiniz', en: 'Log in to access services' },
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
  // Removed duplicate 'common.close' key

    // Advertisements
    'ads.sponsoredContent': { tr: 'Sponsorlu İçerikler', en: 'Sponsored Content' },
    
    // Banner Ads
    'ads.banner.mercedes.title': { tr: 'Mercedes-Benz Kamyonlar', en: 'Mercedes-Benz Trucks' },
    'ads.banner.mercedes.description': { tr: 'Yeni Actros serisi ile güçlü ve ekonomik taşımacılık', en: 'Powerful and economical transportation with the new Actros series' },
    'ads.banner.shell.title': { tr: 'Shell Yakıtları', en: 'Shell Fuels' },
    'ads.banner.shell.description': { tr: 'Profesyonel sürücüler için özel yakıt çözümleri', en: 'Special fuel solutions for professional drivers' },
    'ads.banner.bridgestone.title': { tr: 'Bridgestone Lastikleri', en: 'Bridgestone Tires' },
    'ads.banner.bridgestone.description': { tr: 'Ağır vasıta için dayanıklı ve güvenli lastikler', en: 'Durable and safe tires for heavy vehicles' },
    
    // Sidebar Ads
    'ads.sidebar.gps.title': { tr: 'GPS Takip Sistemi', en: 'GPS Tracking System' },
    'ads.sidebar.gps.description': { tr: 'Araçlarınızı 7/24 takip edin', en: 'Track your vehicles 24/7' },
    'ads.sidebar.insurance.title': { tr: 'Lojistik Sigortası', en: 'Logistics Insurance' },
    'ads.sidebar.insurance.description': { tr: 'Yükünüzü güvence altına alın', en: 'Secure your cargo' },
    'ads.sidebar.insurance.company': { tr: 'GüvenSigorta', en: 'SecureInsurance' },
    'ads.sidebar.finance.title': { tr: 'Kamyon Finansmanı', en: 'Truck Financing' },
    'ads.sidebar.finance.description': { tr: 'Uygun faizlerle araç kredisi', en: 'Vehicle loans with affordable rates' },
    'ads.sidebar.finance.company': { tr: 'FinansBank', en: 'FinanceBank' },

    // Video Gallery Page
    'videoGallery.title': { tr: 'Video Galeri', en: 'Video Gallery' },
    'videoGallery.subtitle': { tr: 'TruckPort hizmetleri ve araç filosu hakkında videolar', en: 'Videos about TruckPort services and vehicle fleet' },
    
    // Video Categories
    'videoGallery.categories.all': { tr: 'Tümü', en: 'All' },
    'videoGallery.categories.trucks': { tr: 'Kamyonlar', en: 'Trucks' },
    'videoGallery.categories.logistics': { tr: 'Lojistik', en: 'Logistics' },
    'videoGallery.categories.testimonials': { tr: 'Müşteri Yorumları', en: 'Testimonials' },
    
    // Sample Videos
    'videoGallery.videos.truckReview.title': { tr: 'Mercedes Actros İncelemesi', en: 'Mercedes Actros Review' },
    'videoGallery.videos.truckReview.description': { tr: 'Filomuzun en yeni kamyonu Mercedes Actros\'un detaylı incelemesi', en: 'Detailed review of our fleet\'s newest truck Mercedes Actros' },
    'videoGallery.videos.logistics.title': { tr: 'Lojistik Süreçlerimiz', en: 'Our Logistics Processes' },
    'videoGallery.videos.logistics.description': { tr: 'TruckPort\'un modern lojistik ve kargo takip sistemleri', en: 'TruckPort\'s modern logistics and cargo tracking systems' },
    'videoGallery.videos.testimonial.title': { tr: 'Müşteri Deneyimleri', en: 'Customer Experiences' },
    'videoGallery.videos.testimonial.description': { tr: 'Memnun müşterilerimizin TruckPort deneyimleri', en: 'Satisfied customers\' TruckPort experiences' },
    
    // Additional Videos
    'videoGallery.videos.volvoTruck.title': { tr: 'Volvo FH Serisi Tanıtımı', en: 'Volvo FH Series Introduction' },
    'videoGallery.videos.volvoTruck.description': { tr: 'Volvo FH kamyonlarının güç ve teknoloji özellikleri', en: 'Power and technology features of Volvo FH trucks' },
    'videoGallery.videos.safety.title': { tr: 'Güvenli Taşımacılık', en: 'Safe Transportation' },
    'videoGallery.videos.safety.description': { tr: 'TruckPort\'ta güvenlik önceliğimiz, güvenli taşımacılık standartları', en: 'Safety is our priority at TruckPort, safe transportation standards' },
    'videoGallery.videos.technology.title': { tr: 'Teknoloji ve Takip', en: 'Technology and Tracking' },
    'videoGallery.videos.technology.description': { tr: 'Son teknoloji GPS takip ve filo yönetim sistemleri', en: 'Latest technology GPS tracking and fleet management systems' },
    'videoGallery.videos.scaniaTruck.title': { tr: 'Scania R450 Performansı', en: 'Scania R450 Performance' },
    'videoGallery.videos.scaniaTruck.description': { tr: 'Scania R450\'nin üstün performans ve yakıt ekonomisi', en: 'Superior performance and fuel economy of Scania R450' },
    'videoGallery.videos.customerStory.title': { tr: 'Müşteri Hikayesi', en: 'Customer Story' },
    'videoGallery.videos.customerStory.description': { tr: 'Uzun yıllardır TruckPort ile çalışan müşterimizin hikayesi', en: 'Story of our customer who has been working with TruckPort for years' },
    'videoGallery.videos.warehousing.title': { tr: 'Depolama Hizmetleri', en: 'Warehousing Services' },
    'videoGallery.videos.warehousing.description': { tr: 'Modern depolama tesisleri ve stok yönetim çözümleri', en: 'Modern warehousing facilities and inventory management solutions' },
    'videoGallery.videos.manTruck.title': { tr: 'MAN TGX Özellikleri', en: 'MAN TGX Features' },
    'videoGallery.videos.manTruck.description': { tr: 'MAN TGX kamyonlarının gelişmiş özellik ve teknolojileri', en: 'Advanced features and technologies of MAN TGX trucks' },
    'videoGallery.videos.companyTour.title': { tr: 'TruckPort Şirket Turu', en: 'TruckPort Company Tour' },
    'videoGallery.videos.companyTour.description': { tr: 'TruckPort tesisleri ve çalışma alanlarının tanıtımı', en: 'Introduction to TruckPort facilities and working areas' },
    'videoGallery.videos.sustainableLogistics.title': { tr: 'Sürdürülebilir Lojistik', en: 'Sustainable Logistics' },
    'videoGallery.videos.sustainableLogistics.description': { tr: 'Çevre dostu lojistik çözümleri ve yeşil taşımacılık', en: 'Eco-friendly logistics solutions and green transportation' },

    // TruckPort Lounge
    'lounge.hero.title': { tr: 'TruckPort Lounge', en: 'TruckPort Lounge' },
    'lounge.hero.subtitle': { tr: 'Sürücülerimiz için konforlu dinlenme alanları ve premium hizmetler', en: 'Comfortable rest areas and premium services for our drivers' },
    'lounge.hero.hours': { tr: 'Saat Açık', en: 'Hours Open' },
    'lounge.hero.locations': { tr: 'Lokasyon', en: 'Locations' },
    'lounge.hero.drivers': { tr: 'Memnun Sürücü', en: 'Happy Drivers' },

    'lounge.facilities.title': { tr: 'Tesislerimiz', en: 'Our Facilities' },
    'lounge.facilities.subtitle': { tr: 'Sürücülerimizin ihtiyaçlarını karşılamak için tasarlanmış modern tesisler', en: 'Modern facilities designed to meet our drivers\' needs' },
    'lounge.facility.restaurant.title': { tr: 'Restoran', en: 'Restaurant' },
    'lounge.facility.restaurant.description': { tr: 'Taze ve lezzetli yemekler, 24 saat hizmet', en: 'Fresh and delicious meals, 24 hour service' },
    'lounge.facility.rest.title': { tr: 'Dinlenme Alanı', en: 'Rest Area' },
    'lounge.facility.rest.description': { tr: 'Konforlu yatak ve dinlenme odaları', en: 'Comfortable beds and rest rooms' },
    'lounge.facility.shower.title': { tr: 'Duş ve Banyo', en: 'Shower & Bath' },
    'lounge.facility.shower.description': { tr: 'Temiz ve modern duş tesisleri', en: 'Clean and modern shower facilities' },
    'lounge.facility.wifi.title': { tr: 'Ücretsiz WiFi', en: 'Free WiFi' },
    'lounge.facility.wifi.description': { tr: 'Yüksek hızlı internet bağlantısı', en: 'High-speed internet connection' },
    'lounge.facility.parking.title': { tr: 'Güvenli Park', en: 'Secure Parking' },
    'lounge.facility.parking.description': { tr: 'Kameralı güvenli park alanları', en: 'Secure parking areas with cameras' },
    'lounge.facility.fuel.title': { tr: 'Yakıt İstasyonu', en: 'Fuel Station' },
    'lounge.facility.fuel.description': { tr: 'Uygun fiyatlı yakıt hizmeti', en: 'Affordable fuel service' },

    'lounge.pricing.title': { tr: 'Üyelik Paketleri', en: 'Membership Plans' },
    'lounge.pricing.subtitle': { tr: 'İhtiyaçlarınıza uygun üyelik paketini seçin', en: 'Choose the membership plan that suits your needs' },
    'lounge.pricing.selectPlan': { tr: 'Paketi Seç', en: 'Select Plan' },
    'lounge.pricing.basic': { tr: 'Temel Paket', en: 'Basic Plan' },
    'lounge.pricing.basic.price': { tr: '₺150/ay', en: '$20/month' },
    'lounge.pricing.basic.feature1': { tr: 'Temel dinlenme alanı', en: 'Basic rest area' },
    'lounge.pricing.basic.feature2': { tr: 'Ücretsiz WiFi', en: 'Free WiFi' },
    'lounge.pricing.basic.feature3': { tr: 'Duş imkanı', en: 'Shower facility' },
    'lounge.pricing.premium': { tr: 'Premium Paket', en: 'Premium Plan' },
    'lounge.pricing.premium.price': { tr: '₺250/ay', en: '$35/month' },
    'lounge.pricing.premium.feature1': { tr: 'Premium dinlenme odası', en: 'Premium rest room' },
    'lounge.pricing.premium.feature2': { tr: 'Restoran indirimi', en: 'Restaurant discount' },
    'lounge.pricing.premium.feature3': { tr: 'Özel park alanı', en: 'Private parking space' },
    'lounge.pricing.premium.feature4': { tr: 'Çamaşırhane hizmeti', en: 'Laundry service' },
    'lounge.pricing.vip': { tr: 'VIP Paket', en: 'VIP Plan' },
    'lounge.pricing.vip.price': { tr: '₺400/ay', en: '$55/month' },
    'lounge.pricing.vip.feature1': { tr: 'VIP süit odalar', en: 'VIP suite rooms' },
    'lounge.pricing.vip.feature2': { tr: 'Ücretsiz yemek', en: 'Free meals' },
    'lounge.pricing.vip.feature3': { tr: 'Kişisel concierge', en: 'Personal concierge' },
    'lounge.pricing.vip.feature4': { tr: 'Premium yakıt indirimi', en: 'Premium fuel discount' },

    'lounge.gallery.title': { tr: 'Tesis Galerisi', en: 'Facility Gallery' },
    'lounge.gallery.subtitle': { tr: 'Modern tesislerimizi keşfedin', en: 'Discover our modern facilities' },
    'lounge.gallery.restaurant': { tr: 'Restoran Alanı', en: 'Restaurant Area' },
    'lounge.gallery.restArea': { tr: 'Dinlenme Alanı', en: 'Rest Area' },
    'lounge.gallery.parking': { tr: 'Park Alanı', en: 'Parking Area' },
    'lounge.gallery.fuelStation': { tr: 'Yakıt İstasyonu', en: 'Fuel Station' },

    'lounge.contact.title': { tr: 'Rezervasyon ve Bilgi', en: 'Reservation & Information' },
    'lounge.contact.subtitle': { tr: 'Üyelik ve rezervasyon için bizimle iletişime geçin', en: 'Contact us for membership and reservations' },
    'lounge.contact.hours': { tr: '24/7 Hizmet', en: '24/7 Service' },
    'lounge.contact.reserve': { tr: 'Rezervasyon Yap', en: 'Make Reservation' }
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
