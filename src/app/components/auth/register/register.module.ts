import { NgModule } from '@angular/core';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { SharedModule } from '../../../share.module';

import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    imports: [
        RegisterRoutingModule,
        SharedModule,
        RadioButtonModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
