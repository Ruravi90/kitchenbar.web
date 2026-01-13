import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meal, User, Inventory, Recipe } from '../../../models';
import { CategoriesInterface, MealsInterface, InventoryInterface, RecipesInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

// Interface for pending recipes (before meal is saved)
interface PendingRecipe {
  inventoryId: number;
  inventoryName: string;
  quantity: number;
  unitMeasure: string;
  unitCost: number;
  totalCost: number;
}


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  mealForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private iMeal: MealsInterface,
    private categoriesServices: CategoriesInterface,
    private inventoryService: InventoryInterface,
    private recipesService: RecipesInterface
  ){}

  initForm() {
    this.mealForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]]
    });
  }

  items: Meal[] = [];
  filteredItems: Meal[] = [];
  searchTerm: string = '';
  highlightedMealId: number | null = null;
  
  meal: Meal = new Meal();
  visibleModal: boolean = false;
  isEdit:boolean = false;
  categories:any[] = [];
  selectedCategory:any;

  // Recipe-related properties
  inventoryItems: Inventory[] = [];
  currentRecipes: Recipe[] = [];
  pendingRecipes: PendingRecipe[] = [];  // NEW: Temporary recipes before saving
  newRecipe: Recipe = new Recipe();
  selectedInventoryItem: Inventory | undefined;

  ngOnInit(): void {
    this.initForm();
    this.getMeals();
    this.getCategories();
    this.getInventory();
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  getMeals(): void {
    this.iMeal.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
        this.filterMeals();
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  filterMeals(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredItems = this.items;
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredItems = this.items.filter(meal =>
        meal.name?.toLowerCase().includes(search)
      );
    }
  }

  getCategories(){
    this.categoriesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  getInventory() {
    this.inventoryService.getItemsByInstance().subscribe({
        next: (data) => this.inventoryItems = data,
        error: (e) => console.error(e)
    });
  }

  getRecipesForMeal(mealId: number) {
    this.recipesService.getByMeal(mealId).subscribe({
        next: (data) => this.currentRecipes = data,
        error: (e) => console.error(e)
    });
  }

  showModal(isEdit:boolean = false, item?:Meal){
    console.log(item);
    this.isEdit = isEdit;
    
    if(isEdit){
      this.meal = item!;
      this.mealForm.patchValue({
        name: item?.name || '',
        price: item?.price || 0,
        categoryId: item?.categoryId
      });
      this.selectedCategory = this.categories.find(i=> i.id == item?.categoryId);
      if(this.meal.id) this.getRecipesForMeal(this.meal.id);
    }
    else {
      this.meal = new Meal();
      this.mealForm.reset();
      this.currentRecipes = [];
      this.pendingRecipes = [];  // Reset pending recipes for new meal
    }
    
    this.newRecipe = new Recipe();
    this.selectedInventoryItem = undefined;
    this.visibleModal = true;
  }

  async confirmSave(){
    if (this.mealForm.invalid) {
      Object.keys(this.mealForm.controls).forEach(key => {
        this.mealForm.get(key)?.markAsTouched();
      });
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'Por favor completa todos los campos requeridos' 
      });
      return;
    }

    const formValue = this.mealForm.value;
    this.meal.name = formValue.name;
    this.meal.price = formValue.price;
    this.meal.categoryId = formValue.categoryId;
    
    if(this.isEdit){
      this.iMeal.updateItem(this.meal!.id!,this.meal).subscribe({
        next: async (data) => {
            // Save pending recipes if any
            await this.savePendingRecipes(this.meal.id!);
            
            this.highlightedMealId = this.meal.id ?? null;
            this.getMeals();
            this.visibleModal = false; 
            this.pendingRecipes = [];  // Clear pending recipes
            this.messageService.add({ 
              severity: 'success', 
              summary: '¡Éxito!', 
              detail: 'Platillo actualizado correctamente' 
            });
            setTimeout(() => this.highlightedMealId = null, 2000);
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.iMeal.createItem(this.meal).subscribe({
        next: async (data) => {
            // Save pending recipes for new meal
            await this.savePendingRecipes(data.id!);
            
            this.highlightedMealId = data.id ?? null;
            this.getMeals();
            this.visibleModal = false;
            this.pendingRecipes = [];  // Clear pending recipes
            this.messageService.add({ 
              severity: 'success', 
              summary: '¡Éxito!', 
              detail: 'Platillo creado correctamente' + 
                (this.pendingRecipes.length > 0 ? ' con ' + this.pendingRecipes.length + ' ingredientes' : '')
            });
            setTimeout(() => this.highlightedMealId = null, 2000);
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.selectedCategory = null;
  }

  // NEW: Cost calculation methods
  calculateIngredientCost(): number {
    if (!this.selectedInventoryItem || !this.newRecipe.quantity) {
      return 0;
    }
    return (this.selectedInventoryItem.cost || 0) * this.newRecipe.quantity;
  }

  getTotalRecipeCost(): number {
    return this.pendingRecipes.reduce((sum, r) => sum + r.totalCost, 0);
  }

  getProfitMargin(): number {
    const price = this.mealForm.get('price')?.value || 0;
    const cost = this.getTotalRecipeCost();
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  }

  // NEW: Add recipe to pending list (before saving meal)
  addRecipeToList() {
    if (!this.selectedInventoryItem || !this.newRecipe.quantity) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Campos incompletos', 
        detail: 'Selecciona ingrediente y cantidad' 
      });
      return;
    }

    // Validate duplicates
    const exists = this.pendingRecipes.find(
      r => r.inventoryId === this.selectedInventoryItem!.id
    );
    
    if (exists) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ingrediente duplicado',
        detail: 'Este ingrediente ya está en la receta. Elimínalo primero si quieres cambiar la cantidad.'
      });
      return;
    }

    // Add to pending list
    this.pendingRecipes.push({
      inventoryId: this.selectedInventoryItem.id!,
      inventoryName: this.selectedInventoryItem.name!,
      quantity: this.newRecipe.quantity!,
      unitMeasure: (this.selectedInventoryItem as any).unit_measure?.description || 'unidades',
      unitCost: this.selectedInventoryItem.cost || 0,
      totalCost: this.calculateIngredientCost()
    });

    // Show low stock warning
    if (this.selectedInventoryItem.stock && 
        this.selectedInventoryItem.stock < (this.newRecipe.quantity! * 10)) {
      this.messageService.add({
        severity: 'info',
        summary: 'Stock bajo',
        detail: `El stock actual de ${this.selectedInventoryItem.name} es ${this.selectedInventoryItem.stock}. Considera reabastecer.`,
        life: 5000
      });
    }

    // Clear form
    this.selectedInventoryItem = undefined;
    this.newRecipe = new Recipe();
  }

  // NEW: Remove recipe from pending list
  removePendingRecipe(index: number) {
    const removed = this.pendingRecipes[index];
    this.pendingRecipes.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Ingrediente eliminado',
      detail: `${removed.inventoryName} eliminado de la receta`
    });
  }

  // NEW: Save all pending recipes after meal is created/updated
  async savePendingRecipes(mealId: number): Promise<void> {
    if (this.pendingRecipes.length === 0) return;

    for (const pending of this.pendingRecipes) {
      const recipe: Recipe = {
        mealId: mealId,
        inventoryId: pending.inventoryId,
        quantity: pending.quantity
      };
      
      try {
        await this.recipesService.createItem(recipe).toPromise();
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    }
  }

  // Recipes Logic (existing, for already saved meals)
  addRecipe() {
    if (!this.selectedInventoryItem || !this.newRecipe.quantity) {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Selecciona ingrediente y cantidad' });
        return;
    }

    if (!this.meal.id) {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Guarda primero el platillo para agregar ingredientes' });
        return;
    }

    const recipe: Recipe = {
        mealId: this.meal.id,
        inventoryId: this.selectedInventoryItem.id,
        quantity: this.newRecipe.quantity
    };

    this.recipesService.createItem(recipe).subscribe({
        next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ingrediente agregado' });
            this.getRecipesForMeal(this.meal.id!);
            this.newRecipe = new Recipe();
            this.selectedInventoryItem = undefined;
        },
        error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar ingrediente' })
    });
  }

  deleteRecipe(id: number) {
      this.recipesService.deleteItem(id).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ingrediente eliminado' });
              this.getRecipesForMeal(this.meal.id!);
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar' })
      });
  }

  confirmDeleted(item:Meal) {
    this.confirmationService.confirm({
        header: '¿Confirmar eliminación?',
        message: `¿Estás seguro de eliminar el platillo <strong>${item.name}</strong>?<br>Esta acción no se puede deshacer.`,
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.iMeal.deleteItem(item.id!).subscribe({
            next: (data) => {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Eliminado', 
                detail: `Platillo ${item.name} eliminado correctamente` 
              });
              this.getMeals();
            },
            error: (e) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.messages });
            }
          });
        }
    });
  }
}
