import { Component } from '@angular/core';
import { Meal, User } from '../../../models';
import { CategoriesInterface, MealsInterface } from '../../../interfaces';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  constructor(
    private confirmationService: ConfirmationService,
    private iMeal: MealsInterface,
    private categoriesServices: CategoriesInterface){}

  items: Meal[] = [];
  meal: Meal = new Meal();
  visibleModal: boolean = false;
  isEdit:boolean = false;
  categories:any[] = [];
  selectedCategory:any;

  ngOnInit(): void {
    this.getMeals();
    this.getCategories();
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  getMeals(): void {
    this.iMeal.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }

  getCategories(){
    this.categoriesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => console.error(e)
    });
  }

  showModal(isEdit:boolean = false, item?:Meal){
    console.log(item);
    this.isEdit = isEdit;
    if(isEdit){
      this.meal = item!;
      this.selectedCategory = this.categories.find(i=> i.id == item?.categoryId);
    }
    else
      this.meal = new Meal();
    this.visibleModal =  true;
  }

  confirmSave(){
    this.meal.categoryId = this.selectedCategory.id;
    if(this.isEdit){
      this.iMeal.updateItem(this.meal!.id!,this.meal).subscribe({
        next: (data) => this.getMeals(),
        error: (e) => console.error(e)
      });
    }
    else{
      this.iMeal.createItem(this.meal).subscribe({
        next: (data) => this.getMeals(),
        error: (e) => console.error(e)
      });
    }

    this.selectedCategory = null;
    this.visibleModal = false;
  }

  confirmDeleted(item:Meal) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.iMeal.deleteItem(this.meal!.id!).subscribe({
            next: (data) => this.getMeals(),
            error: (e) => console.error(e)
          });
        }
    });
  }
}
