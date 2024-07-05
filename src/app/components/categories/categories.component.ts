import { Component } from '@angular/core';
import { CategoriesService } from '../../services';
import { Category } from '../../models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(private categoriesServices: CategoriesService){}

  categories?: Category[];

  ngOnInit(): void {
    this.retrieveTables();
  }

  retrieveTables(): void {
    this.categoriesServices.getItems().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
