import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { MealsService } from '../../services/meals.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    DropdownModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="flex flex-wrap justify-content-center">
      <div class="w-full">
        <p-card header="Gestión de Inventario">
          <div class="mb-3 flex justify-content-end">
            <p-button label="Nuevo Item" icon="pi pi-plus" (onClick)="openNew()"></p-button>
          </div>

          <p-table [value]="inventoryItems" [rows]="10" [paginator]="true" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="meal.name">Platillo <p-sortIcon field="meal.name"></p-sortIcon></th>
                <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
                <th pSortableColumn="unit_measure.name">Unidad <p-sortIcon field="unit_measure.name"></p-sortIcon></th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{ item.meal?.name || 'N/A' }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.unit_measure?.name || 'N/A' }}</td>
                <td>
                  <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" severity="warning" (onClick)="editItem(item)"></p-button>
                  <p-button icon="pi pi-trash" [rounded]="true" [outlined]="true" severity="danger" (onClick)="deleteItem(item)"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>

    <p-dialog [(visible)]="itemDialog" [style]="{ width: '450px' }" header="Detalles de Inventario" [modal]="true" styleClass="p-fluid">
      <ng-template pTemplate="content">
        <div class="field">
          <label for="meal">Platillo</label>
          <p-dropdown 
            id="meal" 
            [options]="meals" 
            [(ngModel)]="selectedMeal" 
            optionLabel="name" 
            placeholder="Selecciona un Platillo"
            [filter]="true"
            filterBy="name"
            [showClear]="true"
            appendTo="body"
            [required]="true">
          </p-dropdown>
        </div>
        <div class="field">
          <label for="stock">Stock</label>
          <p-inputNumber id="stock" [(ngModel)]="item.stock" [required]="true"></p-inputNumber>
        </div>
        <div class="field">
          <label for="unitMeasure">Unidad de Medida</label>
          <p-dropdown 
            id="unitMeasure" 
            [options]="unitMeasures" 
            [(ngModel)]="selectedUnitMeasure" 
            optionLabel="name" 
            placeholder="Selecciona una Unidad"
            appendTo="body"
            [required]="true">
          </p-dropdown>
        </div>
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()"></p-button>
        <p-button label="Guardar" icon="pi pi-check" [text]="true" (onClick)="saveItem()"></p-button>
      </ng-template>
    </p-dialog>

    <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
    <p-toast></p-toast>
  `,
  styles: []
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  item: any = {};
  itemDialog: boolean = false;
  submitted: boolean = false;

  meals: any[] = [];
  selectedMeal: any;

  // Lista estática de unidades de medida (simulando una tabla de BD)
  // En un sistema real, esto vendría de una API
  unitMeasures: any[] = [
    { id: 1, name: 'Unidad' },
    { id: 2, name: 'Kilogramo (kg)' },
    { id: 3, name: 'Gramo (g)' },
    { id: 4, name: 'Litro (L)' },
    { id: 5, name: 'Mililitro (ml)' }
  ];
  selectedUnitMeasure: any;

  constructor(
    private inventoryService: InventoryService,
    private mealsService: MealsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadInventory();
    this.loadMeals();
  }

  loadInventory() {
    this.inventoryService.getInventory().subscribe(data => this.inventoryItems = data);
  }

  loadMeals() {
    this.mealsService.getItemsByInstance().subscribe(data => this.meals = data);
  }

  openNew() {
    this.item = {};
    this.selectedMeal = null;
    this.selectedUnitMeasure = null;
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item: any) {
    this.item = { ...item };
    // Mapear objetos seleccionados
    this.selectedMeal = this.meals.find(m => m.id === item.mealId);
    // Para unit measure, como es estático, buscamos por ID si viene del backend, o por nombre si es lo que tenemos
    // Asumimos que el backend devuelve unitMeasureId
    this.selectedUnitMeasure = this.unitMeasures.find(u => u.id === item.unitMeasureId);
    
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este item?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.deleteInventory(item.id).subscribe(() => {
          this.loadInventory();
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Item eliminado', life: 3000 });
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

    if (this.selectedMeal && this.item.stock !== undefined && this.selectedUnitMeasure) {
      // Asignar IDs desde los objetos seleccionados
      this.item.mealId = this.selectedMeal.id;
      this.item.unitMeasureId = this.selectedUnitMeasure.id;

      if (this.item.id) {
        this.inventoryService.updateInventory(this.item.id, this.item).subscribe(() => {
          this.loadInventory();
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Item actualizado', life: 3000 });
          this.hideDialog();
        });
      } else {
        this.inventoryService.createInventory(this.item).subscribe(() => {
          this.loadInventory();
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Item creado', life: 3000 });
          this.hideDialog();
        });
      }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
    }
  }
}
