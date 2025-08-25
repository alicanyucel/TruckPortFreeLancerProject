import { Component, Inject } from '@angular/core';
import { TranslationService } from '../../../services/translation.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUserName } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLanguage: string;
  userName$: Observable<string>;

  constructor(@Inject(TranslationService) private translationService: TranslationService, private store: Store) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.userName$ = this.store.select(selectUserName);
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.currentLanguage = lang;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}
