import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TokenInterceptor, OfflineInterceptor } from '@kitchenbar/shared-data-access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { 
    AuthInterface, BranchesInterface, CategoriesInterface, 
    DinersInterface, HubInterface, InvoicesInterface, 
    MealsInterface, NotificationsInterface, OrdersInterface, 
    TablesInterface, UsersInterface, DashboardInterface, 
    InventoryInterface, RecipesInterface 
} from '@kitchenbar/shared-data-access';

import { 
    AuthService, BranchesService, CategoriesService, 
    OrderHubService, DinersService, InvoicesService, 
    MealsService, NotificationsService, OrdersService, 
    TablesService, UsersService, DashboardService, 
    InventoryService, RecipesService, ENVIRONMENT_TOKEN
} from '@kitchenbar/shared-data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: ENVIRONMENT_TOKEN, useValue: environment },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true },
    { provide: MealsInterface, useClass: MealsService },
    { provide: AuthInterface, useClass: AuthService },
    { provide: CategoriesInterface, useClass: CategoriesService },
    { provide: OrdersInterface, useClass: OrdersService },
    { provide: TablesInterface, useClass: TablesService },
    { provide: UsersInterface, useClass: UsersService },
    { provide: HubInterface, useClass: OrderHubService },
    { provide: DinersInterface, useClass: DinersService },
    { provide: BranchesInterface, useClass: BranchesService },
    { provide: NotificationsInterface, useClass: NotificationsService },
    { provide: InvoicesInterface, useClass: InvoicesService },
    { provide: DashboardInterface, useClass: DashboardService },
    { provide: InventoryInterface, useClass: InventoryService },
    { provide: RecipesInterface, useClass: RecipesService },
    ConfirmationService,
    MessageService,
    importProvidersFrom(
        NgxStripeModule.forRoot(environment.stripePublicKey),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    )
  ],
};
