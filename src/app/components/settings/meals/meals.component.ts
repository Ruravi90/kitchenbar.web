import { Component } from '@angular/core';
import { Meal, User, Inventory, Recipe } from '../../../models';
import { CategoriesInterface, MealsInterface, InventoryInterface, RecipesInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private iMeal: MealsInterface,
    private categoriesServices: CategoriesInterface,
    private inventoryService: InventoryInterface,
    private recipesService: RecipesInterface
  ){}

  items: Meal[] = [];
  meal: Meal = new Meal();
  visibleModal: boolean = false;
  isEdit:boolean = false;
  categories:any[] = [];
  selectedCategory:any;

  // Recipe-related properties
  inventoryItems: Inventory[] = [];
  currentRecipes: Recipe[] = [];
  newRecipe: Recipe = new Recipe();
  selectedInventoryItem: Inventory | undefined;

  ngOnInit(): void {
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
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
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
      this.selectedCategory = this.categories.find(i=> i.id == item?.categoryId);
      // Load recipes
      if(this.meal.id) this.getRecipesForMeal(this.meal.id);
    }
    else {
      this.meal = new Meal();
      this.currentRecipes = []; 
    }
    
    this.newRecipe = new Recipe(); // Reset new recipe form
    this.selectedInventoryItem = undefined;
    this.visibleModal =  true;
  }

  confirmSave(){
    this.meal.categoryId = this.selectedCategory.id;
    if(this.isEdit){
      this.iMeal.updateItem(this.meal!.id!,this.meal).subscribe({
        next: (data) => {
            this.getMeals();
            this.visibleModal = false; 
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Platillo actualizado' });
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.iMeal.createItem(this.meal).subscribe({
        next: (data) => {
            this.getMeals();
            this.visibleModal = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Platillo creado' });
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.selectedCategory = null;
  }

  // Recipes Logic
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
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.iMeal.deleteItem(this.meal!.id!).subscribe({
            next: (data) => this.getMeals(),
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }
}
