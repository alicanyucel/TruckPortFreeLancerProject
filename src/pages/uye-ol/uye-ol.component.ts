import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-uye-ol',
  templateUrl: './uye-ol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UyeOlComponent {
  registerForm: FormGroup;
  submitted = false;
  showPrivacyModal = false;
  currentLang: string;

  constructor(private fb: FormBuilder, private translationService: TranslationService) {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      privacy: [false, Validators.requiredTrue]
    });
  }

  get f() { return this.registerForm.controls; }

  switchLang(lang: string) {
    this.translationService.setLanguage(lang);
    this.currentLang = lang;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    // Kayıt işlemi burada yapılabilir
    alert(this.translationService.translate('signup.success'));
  }

  openPrivacyModal() {
    this.showPrivacyModal = true;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }
}
