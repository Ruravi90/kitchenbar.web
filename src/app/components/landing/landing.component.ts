import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@kitchenbar/shared-data-access';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    mobileMenuVisible = false;
    scrolled = false;

    constructor(public router: Router, public translationService: TranslationService) { }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.scrolled = window.scrollY > 60;
    }

    switchLanguage(lang: string) {
        this.translationService.setLanguage(lang);
    }

    toggleMobileMenu() {
        this.mobileMenuVisible = !this.mobileMenuVisible;
    }
}
