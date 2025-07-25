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
        <div class="uyeol-form-group privacy-group">
          <button type="button" class="privacy-btn" (click)="openPrivacyModal()">Gizlilik Sözleşmesi ve Yasal Haklar</button>
        </div>
        <button type="submit" class="uyeol-btn">Üye Ol</button>
      </form>
      <div class="uyeol-already-member">
        <span>Zaten üyeyseniz <a routerLink="/giris" class="uyeol-login-link">giriş yapın</a>.</span>
      </div>

      <div *ngIf="showPrivacyModal" class="privacy-modal-overlay" (click)="closePrivacyModal()">
        <div class="privacy-modal" (click)="$event.stopPropagation()">
          <h3>TRUCKPORT GİZLİLİK POLİTİKASI – KULLANICI AYDINLATMA METNİ</h3>
          <div class="privacy-content" style="max-height: 60vh; overflow-y: auto;">
            <p>İşbu Aydınlatma Metni, Truckport mobil uygulamasının kullanımı kapsamında elde edilen kişisel verilerin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) hükümleri uyarınca nasıl toplandığı, işlendiği, saklandığı ve aktarıldığı konusunda kullanıcılarımızı bilgilendirmek amacıyla hazırlanmıştır.</p>
            <strong>Hangi Verileri Topluyoruz?</strong>
            <ul>
              <li>Kimlik ve İletişim Bilgileri: Ad ve soyad, telefon numarası, e-posta adresi</li>
              <li>Cihaz ve Kullanım Bilgileri: IP adresi, tarayıcı türü ve sürümü, uygulama kullanım istatistikleri, cihaz modeli ve işletim sistemi</li>
              <li>Açık Rıza Gerektiren Ek Veriler: Konum, rehber, kamera ve galeri erişimi (yalnızca açık rıza ile)</li>
            </ul>
            <strong>Kişisel Verilerin İşlenme Amaçları</strong>
            <ul>
              <li>Uygulama hizmetlerinin sunulması ve sürdürülebilirliğinin sağlanması</li>
              <li>Konum bazlı hizmetlerin etkinleştirilmesi ve kapatılması</li>
              <li>Müşteri destek hizmetlerinin sağlanması ve geliştirilmesi</li>
              <li>Kullanıcının tercihine bağlı olarak bilgilendirme, kampanya ve tanıtım içeriklerinin paylaşılması</li>
              <li>Hizmet kalitesinin ölçülmesi ve iyileştirilmesi</li>
            </ul>
            <strong>Verileriniz Kimlerle Paylaşılır?</strong>
            <p>Truckport, kullanıcıya ait kişisel verileri üçüncü kişilerle rıza olmaksızın paylaşmaz, satmaz veya ticari amaçla kullanmaz. Ancak hizmetin sağlıklı yürütülebilmesi amacıyla hizmet talebinde bulunan kullanıcı ile talebi kabul eden sürücü arasında iletişim bilgileri güvenli şekilde paylaşılır.</p>
            <strong>Veri Güvenliği</strong>
            <p>Kişisel verilerinizin gizliliği, bütünlüğü ve güvenliği için güncel teknik ve idari tedbirler uygulanmaktadır. İnternet üzerinden gerçekleştirilen hiçbir veri aktarımının veya elektronik saklama sisteminin yüzde yüz güvenli olduğu garanti edilememektedir.</p>
            <strong>Veri Sahibi Olarak Haklarınız</strong>
            <ul>
              <li>Kişisel verilerinin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşleme amacını ve verilerin bu amaca uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenen verilerin düzeltilmesini isteme</li>
              <li>Kişisel verilerin silinmesini veya yok edilmesini talep etme</li>
              <li>İşlenen verilerin otomatik sistemler vasıtasıyla analiz edilmesi sonucunda ortaya çıkan aleyhe sonuçlara itiraz etme</li>
            </ul>
            <strong>Çocukların Gizliliği</strong>
            <p>Truckport hizmetleri 13 yaş altı bireyleri hedeflememektedir. Bu yaş grubuna ait verilerin fark edilmesi durumunda, söz konusu bilgiler derhal silinir.</p>
            <strong>Üçüncü Taraf Bağlantıları</strong>
            <p>Uygulama içerisinde üçüncü taraf internet sitelerine yönlendirmeler bulunabilir. Bu sitelere ilişkin gizlilik uygulamaları Truckport’un sorumluluğunda değildir.</p>
            <strong>Gizlilik Politikasındaki Değişiklikler</strong>
            <p>Gizlilik Politikamız zaman zaman güncellenebilir. Yapılan önemli değişiklikler uygulama içerisinden ve/veya kayıtlı e-posta adresinize bildirilir.</p>
            <strong>İletişim</strong>
            <p>Veri Sorumlusu: Truckport<br>E-posta: <a href="mailto:destek&#64;truckport.net">destek&#64;truckport.net</a></p>
            <hr>
            <h4>Şartlar ve Koşullar</h4>
            <ol>
              <li>Truckport tarafından sunulan hizmetlerin kullanımını düzenler. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.</li>
              <li>Kamyon taşımacılığı, yol yardımı ve araç kurtarma gibi çeşitli yol destek hizmetleri sunulur.</li>
              <li>Truckport, yönlendirme hizmetleri için ücret talep etmez; hizmet sağlayıcılar ücretlendirme yapabilir.</li>
              <li>Truckport, hizmet sağlayıcılar adına hareket etmez ve güvenlik konusunda garanti vermez.</li>
              <li>Kullanıcılar, hizmet talebi sırasında doğru ve eksiksiz bilgi sunmakla yükümlüdür.</li>
              <li>Hizmet talebi yönlendirilmeden önce iptal edilebilir; yönlendirme sonrası iptallerde ücret uygulanabilir.</li>
              <li>Mücbir sebepler nedeniyle hizmetin sağlanamaması veya gecikmesi durumunda sorumluluk kabul edilmez.</li>
              <li>Tehlikeli, yasa dışı veya mevzuata aykırı madde taşıyan araçlar için hizmet sunulmaz.</li>
              <li>Hizmetler belirli bir coğrafi alanla sınırlıdır; alan dışında ek ücretler uygulanabilir.</li>
              <li>Şikayetleriniz için bizimle iletişime geçebilirsiniz. Şikayetleriniz en kısa sürede değerlendirilir.</li>
              <li>Truckport, şartları önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar.</li>
              <li>Türkiye Cumhuriyeti yasalarına tabi olup İstanbul Mahkemeleri yetkilidir.</li>
              <li>Sorularınız için destek&#64;truckport.net adresinden iletişime geçebilirsiniz.</li>
            </ol>
            <hr>
            <h4>Hesap Silme</h4>
            <p>Hesabınızın ve ilgili kişisel verilerinizin silinmesini talep etmek için “Hesap Silme Talebi” başlıklı bir e-posta ile destek&#64;truckport.net adresine başvurabilirsiniz. Talebiniz en kısa sürede incelenir ve hesabınız sistemden kalıcı olarak silinir.</p>
          </div>
          <button class="close-btn" (click)="closePrivacyModal()">Kapat</button>
        </div>
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
      background: linear-gradient(90deg, #2563eb 60%, #1e40af 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 0;
      font-size: 1.15rem;
      font-weight: 700;
      margin-top: 10px;
    .privacy-content {
      color: #222;
      font-weight: 600;
      font-size: 1.08rem;
    }
    .privacy-content strong, .privacy-content h3, .privacy-content h4 {
      color: #1e40af;
      font-weight: 700;
    }
    .close-btn {
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(37,99,235,0.08);
      transition: background 0.18s;
    }
    .uyeol-btn:hover {
      background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
    }
    .privacy-group {
      margin-top: 8px;
      text-align: left;
    }
    .privacy-btn {
      background: #1976d2;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .privacy-modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .privacy-modal {
      background: #fff;
      padding: 32px;
      border-radius: 10px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
      max-width: 400px;
      width: 100%;
      position: relative;
    }
    .close-btn {
      background: #e53935;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 16px;
    }
  `]
})
export class UyeOlComponent {
  showPrivacyModal = false;

  openPrivacyModal() {
    this.showPrivacyModal = true;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }
}
