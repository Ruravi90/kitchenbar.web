import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesInterface, MealsInterface, OrdersInterface } from '../../interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MessageService]
})
export class MenuComponent implements OnInit {
  categories: any[] = [];
  meals: any[] = [];
  filteredMeals: any[] = [];
  selectedCategory: any = null;
  
  sortOptions: any[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  displayDetails: boolean = false;
  selectedMeal: any = null;

  cart: any[] = [];
  cartVisible: boolean = false;

  categoryOptions: any[] = [];

  tableId?: number;
  dinerId?: number;

  constructor(
    private categoriesService: CategoriesInterface,
    private mealsService: MealsInterface,
    private ordersService: OrdersInterface,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const identity = params['identity'];
      if (identity) {
        this.loadData(identity);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'] ? +params['tableId'] : undefined;
      this.dinerId = params['dinerId'] ? +params['dinerId'] : undefined;
    });
    
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  loadData(identity: string) {
    this.categoriesService.getPublic(identity).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.categoryOptions = [{ name: 'Todas', id: null }, ...cats];
        this.selectedCategory = this.categoryOptions[0];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      }
    });

    this.mealsService.getPublic(identity).subscribe({
      next: (meals) => {
        this.meals = meals;
        this.filteredMeals = meals;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load meals' });
      }
    });
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category;
    if (category && category.id) {
      this.filteredMeals = this.meals.filter(m => m.categoryId === category.id);
    } else {
      this.filteredMeals = this.meals;
    }
  }

  getNameCategory(categoryId: number) {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  showDetails(meal: any) {
    this.selectedMeal = meal;
    this.displayDetails = true;
  }

  addToCart(meal: any) {
    this.cart.push(meal);
    this.messageService.add({ severity: 'success', summary: 'Added to Cart', detail: meal.name });
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  get cartTotal() {
    return this.cart.reduce((acc, item) => acc + item.price, 0);
  }

  placeOrder() {
    if (this.cart.length === 0) return;

    const order = {
      // Construct order object based on API requirements
      // This is a simplified example
      items: this.cart.map(item => ({ mealId: item.id, quantity: 1 })),
      total: this.cartTotal
    };

    this.ordersService.createItem(order).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Order Placed', detail: 'Your order has been sent to the kitchen.' });
      this.cart = [];
      this.cartVisible = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to place order.' });
    });
  }
}
