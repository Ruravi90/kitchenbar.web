import { Component } from '@angular/core';
import { Meal, User } from '../../../models';
import { MealsInterface } from '../../../interfaces';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  constructor( private confirmationService: ConfirmationService,private iMeal: MealsInterface){}

  items: Meal[] = [];
  meal: Meal = new Meal();
  visibleModal: boolean = false;
  isEdit:boolean = false;

  ngOnInit(): void {
    this.getMeals();
  }

  getMeals(): void {
    this.iMeal.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }

  showModal(isEdit:boolean = false, item?:Meal){
    this.isEdit = isEdit;
    if(isEdit)
      this.meal = item!;
    else
      this.meal = new Meal();

    this.visibleModal =  true;
  }

  confirmSave(){
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
    this.visibleModal = false;
  }

  confirmDeleted(item:Meal) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
        }
    });
  }
}
