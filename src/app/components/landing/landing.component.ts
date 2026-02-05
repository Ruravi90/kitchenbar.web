import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    mobileMenuVisible = false;

    constructor(public router: Router, public translationService: TranslationService) { }
    
    switchLanguage(lang: string) {
        this.translationService.setLanguage(lang);
    }

    toggleMobileMenu() {
        this.mobileMenuVisible = !this.mobileMenuVisible;
    }
}
