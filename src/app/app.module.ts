import { NgModule, OnInit, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TokenInterceptor } from './utilities/token.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];

import {AuthService,CategoriesService,OrderHubService,MealsService,OrdersService,TablesService,UsersService, DinersService, BranchesService} from './services' 
import { AuthInterface, BranchesInterface, CategoriesInterface, DinersInterface, HubInterface, MealsInterface, OrdersInterface, TablesInterface, UsersInterface } from './interfaces';

@NgModule({ declarations: [AppComponent, NotfoundComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AppLayoutModule,
      ], 
      providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: MealsInterface, useClass: MealsService },
        { provide: AuthInterface, useClass: AuthService },
        { provide: CategoriesInterface, useClass: CategoriesService },
        { provide: OrdersInterface, useClass: OrdersService },
        { provide: TablesInterface, useClass: TablesService },
        { provide: UsersInterface, useClass: UsersService },
        { provide: HubInterface, useClass: OrderHubService },
        { provide: DinersInterface, useClass: DinersService },
        { provide: BranchesInterface, useClass: BranchesService },
        httpInterceptorProviders,
        ConfirmationService,
        MessageService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule{ 
  
}