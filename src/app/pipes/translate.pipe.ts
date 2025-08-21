import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private currentLang: string;
  private sub: Subscription;

  constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef) {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.sub = this.translationService.getLanguage$().subscribe(lang => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

/* Türkçe Açıklama:
   Bu pipe, verilen anahtarın çevirisini döndürür. Kullanımı: {{'key' | translate}}
*/
