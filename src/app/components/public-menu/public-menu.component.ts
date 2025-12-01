import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../services/meals.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-public-menu',
  template: `
    <div class="surface-ground min-h-screen">
        <div class="surface-overlay py-3 px-4 shadow-2 flex align-items-center justify-content-between relative lg:static" style="min-height: 80px">
            <span class="text-900 font-medium text-2xl line-height-3 mr-8">Menú Digital</span>
            <a class="cursor-pointer block lg:hidden text-700 p-ripple" pRipple>
                <i class="pi pi-bars text-4xl"></i>
            </a>
            <div class="align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 top-100 z-1 shadow-2 lg:shadow-none surface-overlay">
                <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                    <!-- Categories could go here -->
                </ul>
                <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    <button pButton pRipple label="Ver Carrito ({{cartCount}})" icon="pi pi-shopping-cart" class="p-button-text font-bold" (click)="goToCheckout()"></button>
                </div>
            </div>
        </div>

        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-6 lg:col-3" *ngFor="let meal of meals">
                    <div class="surface-card shadow-2 p-3 border-round">
                        <div class="relative mb-3">
                            <span class="surface-card text-900 shadow-2 px-3 py-2 absolute" style="left: 1rem; top: 1rem; border-radius: 30px">{{ meal.price | currency }}</span>
                            <img [src]="meal.image ? meal.image : 'assets/images/food/default.jpg'" class="w-full border-round" style="height: 200px; object-fit: cover;" alt="{{meal.name}}">
                        </div>
                        <div class="flex justify-content-between align-items-center mb-2">
                            <span class="text-900 font-medium text-xl">{{ meal.name }}</span>
                        </div>
                        <p class="mt-0 mb-3 text-600 line-height-3">{{ meal.description }}</p>
                        <button pButton pRipple label="Agregar" icon="pi pi-plus" class="w-full" (click)="addToCart(meal)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class PublicMenuComponent implements OnInit {
  meals: any[] = [];
  cartCount = 0;
  identity: string = '';

  constructor(private mealsService: MealsService, private cartService: CartService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.identity = this.route.snapshot.paramMap.get('identity') || '';
    
    this.route.queryParams.subscribe(params => {
        const tableId = params['tableId'];
        if (tableId) {
            this.cartService.setTableId(Number(tableId));
        }
    });

    if (this.identity) {
        this.mealsService.getPublic(this.identity).subscribe((data: any) => {
            // The API returns the list of meals directly
            if (Array.isArray(data)) {
                this.meals = data;
            } else if (data && data.meals) {
                 // Fallback in case it changes
                this.meals = data.meals;
            }
        });
    }

    this.cartService.items$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  addToCart(meal: any) {
    this.cartService.addToCart(meal);
  }

  goToCheckout() {
    this.router.navigate(['/public/checkout']);
  }
}
