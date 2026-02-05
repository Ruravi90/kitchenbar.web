import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LandingComponent } from './landing.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@NgModule({
    imports: [
        CommonModule,
        LandingRoutingModule,
        ButtonModule,
        RippleModule
    ],
    declarations: [LandingComponent, TranslatePipe]
})
export class LandingModule { }

