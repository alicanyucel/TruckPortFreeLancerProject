import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLanguage: string;

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.currentLanguage = lang;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}
