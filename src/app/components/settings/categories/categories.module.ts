import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DataViewModule } from 'primeng/dataview';
import {NgxImageCompressService} from 'ngx-image-compress';

@NgModule({
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        CardModule,
        PanelModule,
        IconFieldModule,
        InputIconModule,
        AutoCompleteModule,
        DataViewModule
    ],
    declarations: [CategoriesComponent],
    providers:[NgxImageCompressService]
})
export class CategoriesModule { }