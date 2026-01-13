import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models';
import { CategoriesInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categoryForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private categoriesServices: CategoriesInterface){}

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  categories: Category[] =[];
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  highlightedCategoryId: number | null = null;
  
  categorie: Category = {};
  visibleModal: boolean = false;
  isEdit:boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
  }

  getCategories(){
    this.categoriesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
        this.filterCategories();
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    })
  }

  filterCategories(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredCategories = this.categories;
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredCategories = this.categories.filter(cat =>
        cat.name?.toLowerCase().includes(search)
      );
    }
  }

  showModal(isEdit:boolean = false, item?:Category){
    this.isEdit = isEdit;
    
    if(isEdit){
      this.categorie = item!;
      this.categoryForm.patchValue({
        name: item?.name || ''
      });
    } else {
      this.categorie = new Category();
      this.categoryForm.reset();
    }

    this.visibleModal = true;
  }
  confirmSave(){
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'Por favor completa todos los campos requeridos' 
      });
      return;
    }

    const formValue = this.categoryForm.value;
    this.categorie.name = formValue.name;
    
    if(this.isEdit){
      this.categoriesServices.updateItem(this.categorie!.id!,this.categorie).subscribe({
        next: (data) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Éxito!', 
            detail: 'Categoría actualizada correctamente' 
          });
          this.highlightedCategoryId = this.categorie.id ?? null;
          this.getCategories();
          setTimeout(() => this.highlightedCategoryId = null, 2000);
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.categoriesServices.createItem(this.categorie).subscribe({
        next: (data) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Éxito!', 
            detail: 'Categoría creada correctamente' 
          });
          this.highlightedCategoryId = data.id ?? null;
          this.getCategories();
          setTimeout(() => this.highlightedCategoryId = null, 2000);
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.visibleModal = false;
  }

  confirmDeleted(item:Category) {
    this.confirmationService.confirm({
        header: '¿Confirmar eliminación?',
        message: `¿Estás seguro de eliminar la categoría <strong>${item.name}</strong>?<br>Esta acción no se puede deshacer.`,
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.categoriesServices.deleteItem(item.id!).subscribe({
            next: (data) => {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Eliminada', 
                detail: `Categoría ${item.name} eliminada correctamente` 
              });
              this.getCategories();
            },
            error: (e) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.messages });
            }
          });
        }
    });
  }
}
