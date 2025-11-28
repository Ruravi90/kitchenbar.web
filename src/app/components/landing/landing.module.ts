import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { LandingComponent } from './landing.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@NgModule({
    imports: [
        CommonModule,
        LandingRoutingModule,
        DividerModule,
        StyleClassModule,
        PanelModule,
        ButtonModule
    ],
    declarations: [LandingComponent, TranslatePipe]
})
export class LandingModule { }
