import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';

import { TokenInterceptor } from './utilities/token.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];

import {AuthService,CategoriesService,MealsService,OrdersService,TablesService,UsersService} from './services' 
import { AuthInterface, CategoriesInterface, MealsInterface, OrdersInterface, TablesInterface, UsersInterface } from './interfaces';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    AppLayoutModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: MealsInterface, useClass: MealsService },
    { provide: AuthInterface, useClass: AuthService },
    { provide: CategoriesInterface, useClass: CategoriesService },
    { provide: OrdersInterface, useClass: OrdersService },
    { provide: TablesInterface, useClass: TablesService },
    { provide: UsersInterface, useClass: UsersService },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }