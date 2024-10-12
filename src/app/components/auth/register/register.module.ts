import { NgModule } from '@angular/core';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        RegisterRoutingModule,
        SharedModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
