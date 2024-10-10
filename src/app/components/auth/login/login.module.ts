import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        LoginRoutingModule,
        SharedModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
