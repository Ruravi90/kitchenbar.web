import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../layout/service/app.layout.service';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

    constructor(public layoutService: LayoutService, public router: Router, public translationService: TranslationService) { }
    
    switchLanguage(lang: string) {
        this.translationService.setLanguage(lang);
    }
}
