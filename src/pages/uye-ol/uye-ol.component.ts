import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../app/models/user.model';
import { ToastrService } from '../../services/toastr.service';
import { Router } from '@angular/router';
import { auth, db } from '../../services/firebase.service';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, runTransaction } from 'firebase/database';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-register',
	templateUrl: './uye-ol.component.html',
	styleUrls: ['./uye-ol.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
	registerForm: FormGroup;
	profilePreview: string | null = null;
	showPrivacy = false;
	// basic in-component translations
	lang: 'tr' | 'en' = 'tr';
	translations: any = {
		tr: {
			title: 'Kayıt Ol',
			firstName: 'Ad',
			lastName: 'Soyad',
			username: 'Kullanıcı Adı',
			email: 'E-posta',
			password: 'Şifre',
			phone: 'Telefon',
			language: 'Dil',
			currency: 'Para Birimi',
			role: 'Rol',
			balance: 'Bakiye (amount)',
			cc: 'Kredi Kartı (cc)',
			proPic: "Profil Resmi (URL)",
			rating: 'Puan (rating)',
			status: 'Durum (status)',
			trips: 'Yolculuk Sayısı (trips)',
			accept: 'Kabul Durumu (accept_status)',
			wallet: 'Cüzdan (wallet)',
			submit: 'Kayıt Ol'
		},
		en: {
			title: 'Register',
			firstName: 'First name',
			lastName: 'Last name',
			username: 'Username',
			email: 'Email',
			password: 'Password',
			phone: 'Phone',
			language: 'Language',
			currency: 'Currency',
			role: 'Role',
			balance: 'Balance',
			cc: 'Credit Card (cc)',
			proPic: 'Profile Picture (URL)',
			rating: 'Rating',
			status: 'Status',
			trips: 'Trips',
			accept: 'Accept Status',
			wallet: 'Wallet'
		}
	};
// kayıt basarılı
 	 private langSub: Subscription | null = null;

	 constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, private translationService: TranslationService) {
		this.registerForm = this.fb.group({
			balance_amount: [''],
			cc: [''],
			currency: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			role: ['user', Validators.required],
			fname: ['', Validators.required],
			language: ['', Validators.required],
			lname: ['', Validators.required],
			mobile: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
			name: ['', Validators.required],
				pro_pic: [''],
				acceptedPrivacy: [false, [Validators.requiredTrue]],
			rating: [''],
			status: [''],
			trips: [''],
			accept_status: [''],
			wallet: ['']
		});
	}

	onProfileFileChange(e: Event) {
		try {
			const input = e.target as HTMLInputElement;
			if (!input.files || input.files.length === 0) return;
			const f = input.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				this.profilePreview = result;
				// store data URL into form control so it's saved with profile (small images only)
				this.registerForm.patchValue({ pro_pic: result });
			};
			reader.readAsDataURL(f);
		} catch (err) {
			console.warn('Could not read profile file', err);
		}
	}

	openPrivacy() { this.showPrivacy = true; }
	closePrivacy() { this.showPrivacy = false; }

	ngOnInit(): void {
		// initialize from global translation service
		this.lang = this.translationService.getCurrentLanguage() as 'tr' | 'en';
		this.langSub = this.translationService.getLanguage$().subscribe(l => {
			if (l === 'tr' || l === 'en') {
				this.lang = l as 'tr' | 'en';
			}
		});
	}

	translate(key: string): string {
		// prefer global translation service if it has the key, otherwise fallback to local table
		const global = this.translationService.translate(key);
		if (global && global !== key) return global;
		return this.translations[this.lang] && this.translations[this.lang][key] ? this.translations[this.lang][key] : key;
	}

	switchLanguage(l: 'tr'|'en'){
		this.lang = l;
		this.translationService.setLanguage(l);
		// keep form language in sync
		this.registerForm.patchValue({ language: l === 'tr' ? 'tr' : 'en' });
	}

	ngOnDestroy(): void {
		if (this.langSub) { this.langSub.unsubscribe(); this.langSub = null; }
	}

	onSubmit = async () => {
		if (!this.registerForm.valid) {
			this.toastr.error('Kayıt başarısız! Lütfen tüm alanları doğru doldurun.', 'Hata');
			return;
		}

		const formValue = this.registerForm.value as any;
		const email = formValue.email;
		const password = formValue.password;

		try {
			// Create Firebase Auth user
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			const uid = cred.user.uid;

			// Prepare profile (remove password before saving)
			const profile: any = { ...formValue };
			delete profile.password;
			profile.createdAt = Date.now();

			// Save profile under users/<uid>
			await set(ref(db, `users/${uid}`), profile);

			// Read back the saved profile to verify
			try {
				const snap = await get(ref(db, `users/${uid}`));
				if (snap && snap.exists()) {
					const saved = snap.val();
					this.toastr.success('Kayıt başarılı! Veri Firebase\'e kaydedildi.', 'Başarılı');
					console.log('Kayıt verisi kaydedildi (okunan):', uid, saved);
				} else {
					this.toastr.info('Kayıt tamamlandı ancak veritabanında kayıt bulunamadı.', 'Uyarı');
					console.warn('Kayıt sonrası okunamadı:', uid);
				}
			} catch (readErr) {
				console.error('Kayıt sonrası okuma hatası:', readErr);
				this.toastr.error('Kayıt yapıldı fakat doğrulama sırasında hata oluştu.', 'Hata');
			}
			// navigate to login
			this.router.navigate(['/giris']);
		} catch (err: any) {
			console.error('Kayıt hatası:', err);
			const message = err?.code ? this.mapAuthError(err.code, err.message) : (err?.message || 'Kayıt sırasında hata oluştu');
			this.toastr.error(message, 'Hata');
		}
	}

	private mapAuthError(code?: string, fallback?: string): string {
		switch (code) {
			case 'auth/email-already-in-use':
				return 'Bu e-posta zaten kullanılıyor.';
			case 'auth/invalid-email':
				return 'Geçersiz e-posta adresi.';
			case 'auth/weak-password':
				return 'Şifre çok zayıf. En az 6 karakter girin.';
			case 'auth/network-request-failed':
				return 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
			default:
				return fallback || 'Kayıt sırasında bir hata oluştu.';
		}
	}
}
