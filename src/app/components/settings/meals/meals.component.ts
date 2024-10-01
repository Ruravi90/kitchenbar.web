import { Component } from '@angular/core';
import { User } from '../../../models';
import { MealsInterface } from '../../../interfaces';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  constructor(private iMeal: MealsInterface){}

  items?: User[];

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.iMeal.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }
}
