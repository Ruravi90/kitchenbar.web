import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { MealsService } from '../../services/meals.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    RadioButtonModule,
    InputNumberModule,
    DropdownModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  filteredItems: any[] = [];
  itemForm!: FormGroup;
  item: any = {};
  itemDialog: boolean = false;
  submitted: boolean = false;
  inventoryType: 'meal' | 'ingredient' = 'meal';
  
  // Search
  searchTerm: string = '';
  highlightedItemId: number | null = null;

  // Waste UI
  wasteDialog: boolean = false;
  wasteItem: any = {};
  wasteQuantity: number = 0;
  wasteReason: string = '';
  wasteReasons: string[] = ['Caducado', 'Dañado', 'Error de Preparación', 'Robo', 'Cortesía no registrada'];

  meals: any[] = [];
  selectedMeal: any;

  unitMeasures: any[] = [
    { id: 1, name: 'Unidad' },
    { id: 2, name: 'Kilogramo (kg)' },
    { id: 3, name: 'Gramo (g)' },
    { id: 4, name: 'Litro (L)' },
    { id: 5, name: 'Mililitro (ml)' }
  ];
  selectedUnitMeasure: any;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private mealsService: MealsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadInventory();
    this.loadMeals();
  }
  
  initForm() {
    this.itemForm = this.fb.group({
      name: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      cost: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  filterItems() {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.inventoryItems];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.inventoryItems.filter(item =>
      (item.meal?.name?.toLowerCase().includes(term)) ||
      (item.name?.toLowerCase().includes(term)) ||
      (item.unit_measure?.name?.toLowerCase().includes(term))
    );
  }

  loadInventory() {
    this.inventoryService.getItemsByInstance().subscribe(data => {
      this.inventoryItems = data;
      this.filteredItems = [...data];
    });
  }

  loadMeals() {
    this.mealsService.getItemsByInstance().subscribe(data => this.meals = data);
  }

  openNew() {
    this.item = {};
    this.itemForm.reset({
      name: '',
      stock: 0,
      cost: 0
    });
    this.selectedMeal = null;
    this.selectedUnitMeasure = null;
    this.submitted = false;
    this.inventoryType = 'meal';
    this.itemDialog = true;
  }

  editItem(item: any) {
    this.item = { ...item };
    this.inventoryType = item.mealId ? 'meal' : 'ingredient';
    this.selectedMeal = this.meals.find(m => m.id === item.mealId);
    this.selectedUnitMeasure = this.unitMeasures.find(u => u.id === item.unitMeasureId);
    
    this.itemForm.patchValue({
      name: item.name || '',
      stock: item.stock || 0,
      cost: item.cost || 0
    });
    
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este item?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.inventoryService.deleteItem(item.id).subscribe(() => {
          this.loadInventory();
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Exitoso', 
            detail: 'Item eliminado', 
            life: 3000 
          });
        });
      }
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    // Get form values
    const formValue = this.itemForm.value;

    // Validation
    if (!this.selectedUnitMeasure) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Seleccione unidad de medida', 
        life: 3000 
      });
      return;
    }

    if (this.itemForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Complete los campos requeridos', 
        life: 3000 
      });
      return;
    }

    if (this.inventoryType === 'meal' && !this.selectedMeal) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Seleccione un platillo', 
        life: 3000 
      });
      return;
    }

    if (this.inventoryType === 'ingredient' && !formValue.name?.trim()) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Ingrese nombre del ingrediente', 
        life: 3000 
      });
      return;
    }

    // Prepare data
    this.item.stock = formValue.stock;
    this.item.cost = formValue.cost;
    this.item.unitMeasureId = this.selectedUnitMeasure.id;

    if (this.inventoryType === 'meal') {
      this.item.mealId = this.selectedMeal.id;
      this.item.name = null;
    } else {
      this.item.name = formValue.name;
      this.item.mealId = null;
    }

    // Save
    if (this.item.id) {
      this.inventoryService.updateItem(this.item.id, this.item).subscribe({
        next: (updated) => {
          this.loadInventory();
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Exitoso', 
            detail: 'Item actualizado', 
            life: 3000 
          });
          this.highlightedItemId = updated?.id || null;
          setTimeout(() => this.highlightedItemId = null, 2000);
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo actualizar', 
            life: 3000 
          });
        }
      });
    } else {
      this.inventoryService.createItem(this.item).subscribe({
        next: (created) => {
          this.loadInventory();
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Exitoso', 
            detail: 'Item creado', 
            life: 3000 
          });
          this.highlightedItemId = created?.id || null;
          setTimeout(() => this.highlightedItemId = null, 2000);
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo crear', 
            life: 3000 
          });
        }
      });
    }
  }

  // Waste Logic
  openWaste(item: any) {
      this.wasteItem = item;
      this.wasteQuantity = 0;
      this.wasteReason = '';
      this.wasteDialog = true;
  }

  hideWasteDialog() {
      this.wasteDialog = false;
  }

  confirmWaste() {
      if (this.wasteQuantity <= 0 || !this.wasteReason) {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Ingrese cantidad y razón' });
          return;
      }

      const wasteData = {
          inventoryId: this.wasteItem.id,
          quantity: this.wasteQuantity,
          reason: this.wasteReason
      };

      this.inventoryService.recordWaste(wasteData).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Merma registrada' });
              this.loadInventory();
              this.hideWasteDialog();
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar merma' })
      });
  }
}
