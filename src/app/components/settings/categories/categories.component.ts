import { Component } from '@angular/core';
import { Category } from '../../../models';
import { CategoriesInterface } from '../../../interfaces';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(
    private confirmationService: ConfirmationService, 
    private categoriesServices: CategoriesInterface){}

  categories: Category[] =[];
  categorie: Category = {};
  visibleModal: boolean = false;
  isEdit:boolean = false;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.categoriesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => console.error(e)
    })
  }

  showModal(isEdit:boolean = false, item?:Category){
    this.isEdit = isEdit;
    if(isEdit)
      this.categorie = item!;
    else
      this.categorie = new Category();

    this.visibleModal =  true;
  }
  confirmSave(){
    if(this.isEdit){
      this.categoriesServices.updateItem(this.categorie!.id!,this.categorie).subscribe({
        next: (data) => this.getCategories(),
        error: (e) => console.error(e)
      });
    }
    else{
      this.categoriesServices.createItem(this.categorie).subscribe({
        next: (data) => this.getCategories(),
        error: (e) => console.error(e)
      });
    }
    this.visibleModal = false;
  }

  confirmDeleted(item:Category) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.categoriesServices.deleteItem(this.categorie!.id!).subscribe({
            next: (data) => this.getCategories(),
            error: (e) => console.error(e)
          });
        }
    });
  }
}
