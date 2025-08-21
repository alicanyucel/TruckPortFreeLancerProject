import { Component, OnDestroy, Inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectUserName } from '../../store/user/user.selectors';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnDestroy {
  currentLanguage: string;
  userName$: Observable<string>;
  private sub: Subscription | null = null;

  constructor(private translationService: TranslationService, @Inject(Store) private store: Store) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.userName$ = this.store.select(selectUserName);
    this.sub = this.translationService.getLanguage$().subscribe(lang => this.currentLanguage = lang);
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
