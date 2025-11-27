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

  groupedMeals: { category: any, meals: any[] }[] = [];

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
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No restaurant identity provided.' });
      }
    });

    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'] ? +params['tableId'] : undefined;
      this.dinerId = params['dinerId'] ? +params['dinerId'] : undefined;
    });
    
    this.sortOptions = [
      { label: 'Precio: Mayor a Menor', value: '!price' },
      { label: 'Precio: Menor a Mayor', value: 'price' }
    ];
  }

  loadData(identity: string) {
    // We need both categories and meals to group them effectively.
    // Ideally use forkJoin, but for minimal refactor, we can just load independently and call groupMeals()
    
    this.categoriesService.getPublic(identity).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.categoryOptions = [{ name: 'Todas', id: null }, ...cats];
        this.selectedCategory = this.categoryOptions[0];
        this.groupMeals();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías' });
      }
    });

    this.mealsService.getPublic(identity).subscribe({
      next: (meals) => {
        this.meals = meals;
        this.filteredMeals = meals;
        this.groupMeals();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar platillos' });
      }
    });
  }

  groupMeals() {
    if (!this.categories.length || !this.meals.length) return;

    // If a specific category is selected (and it's not "All"), show only that category group
    if (this.selectedCategory && this.selectedCategory.id) {
      const cat = this.categories.find(c => c.id === this.selectedCategory.id);
      if (cat) {
        const catMeals = this.meals.filter(m => m.categoryId === cat.id);
        this.groupedMeals = [{ category: cat, meals: catMeals }];
      }
    } else {
      // Show all categories that have meals
      this.groupedMeals = this.categories.map(cat => {
        return {
          category: cat,
          meals: this.meals.filter(m => m.categoryId === cat.id)
        };
      }).filter(group => group.meals.length > 0);
    }
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category;
    this.groupMeals();
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
    this.messageService.add({ severity: 'success', summary: 'Agregado al Carrito', detail: meal.name });
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
      this.messageService.add({ severity: 'success', summary: 'Orden Enviada', detail: 'Tu orden ha sido enviada a la cocina.' });
      this.cart = [];
      this.cartVisible = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar la orden.' });
    });
  }

  onRate(meal: any, event: any) {
    this.mealsService.rate(meal.id, event.value).subscribe({
      next: (response) => {
        meal.rating = response.rating;
        meal.ratingCount = response.ratingCount;
        this.messageService.add({ severity: 'success', summary: 'Gracias', detail: 'Tu calificación ha sido guardada.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar tu calificación.' });
      }
    });
  }
}
