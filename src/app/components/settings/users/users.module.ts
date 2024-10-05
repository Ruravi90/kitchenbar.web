import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        UsersRoutingModule,
        SharedModule
    ],
    declarations: [UsersComponent]
})
export class UsersModule { }