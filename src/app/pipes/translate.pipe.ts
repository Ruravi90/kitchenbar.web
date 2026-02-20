import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '@kitchenbar/shared-data-access';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false // Impure pipe to update on language change
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private langChangeSubscription: Subscription;
  private lastKey: string = '';
  private lastValue: string = '';

  constructor(private translationService: TranslationService, private _ref: ChangeDetectorRef) {
    this.langChangeSubscription = this.translationService.currentLang$.subscribe(() => {
        this._ref.markForCheck();
    });
  }

  transform(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
