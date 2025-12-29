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
                <th pSortableColumn="name">Nombre (Ingrediente) <p-sortIcon field="name"></p-sortIcon></th>
                <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
                <th pSortableColumn="unit_measure.name">Unidad <p-sortIcon field="unit_measure.name"></p-sortIcon></th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{ item.meal?.name || '---' }}</td>
                <td>{{ item.name || '---' }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.unit_measure?.name || 'N/A' }}</td>
                <td>
                  <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" severity="warning" (onClick)="editItem(item)" pTooltip="Editar"></p-button>
                  <p-button icon="pi pi-trash" class="mr-2" [rounded]="true" [outlined]="true" severity="danger" (onClick)="deleteItem(item)" pTooltip="Eliminar"></p-button>
                  <p-button icon="pi pi-exclamation-triangle" [rounded]="true" [outlined]="true" severity="help" (onClick)="openWaste(item)" pTooltip="Reportar Merma"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>

    <!-- Edit/New Dialog -->
    <p-dialog [(visible)]="itemDialog" [style]="{ width: '450px' }" header="Detalles de Inventario" [modal]="true" styleClass="p-fluid">
      <ng-template pTemplate="content">
        <div class="field">
          <label for="type">Tipo</label>
          <div class="flex gap-3">
              <div class="flex align-items-center">
                  <p-radioButton name="type" value="meal" [(ngModel)]="inventoryType" inputId="type1"></p-radioButton>
                  <label for="type1" class="ml-2">Platillo</label>
              </div>
              <div class="flex align-items-center">
                  <p-radioButton name="type" value="ingredient" [(ngModel)]="inventoryType" inputId="type2"></p-radioButton>
                  <label for="type2" class="ml-2">Ingrediente Puro</label>
              </div>
          </div>
        </div>

        <div class="field" *ngIf="inventoryType === 'meal'">
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
            appendTo="body">
          </p-dropdown>
        </div>

        <div class="field" *ngIf="inventoryType === 'ingredient'">
            <label for="name">Nombre del Ingrediente</label>
            <input type="text" pInputText id="name" [(ngModel)]="item.name" required autofocus />
        </div>

        <div class="field">
          <label for="stock">Stock Actual</label>
          <p-inputNumber id="stock" [(ngModel)]="item.stock" [required]="true"></p-inputNumber>
        </div>
        
        <div class="field">
          <label for="cost">Costo Unitario</label>
          <p-inputNumber id="cost" [(ngModel)]="item.cost" mode="currency" currency="USD" locale="en-US"></p-inputNumber>
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

    <!-- Waste Dialog -->
    <p-dialog [(visible)]="wasteDialog" [style]="{ width: '400px' }" header="Reportar Merma" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
            <div class="field">
                <label>Item</label>
                <input pInputText [disabled]="true" [value]="wasteItem?.meal?.name || wasteItem?.name" />
            </div>
            <div class="field">
                <label for="wasteQty">Cantidad Perdida</label>
                <p-inputNumber id="wasteQty" [(ngModel)]="wasteQuantity" [min]="0" [max]="wasteItem?.stock"></p-inputNumber>
            </div>
            <div class="field">
                <label for="reason">Razón</label>
                <p-dropdown [options]="wasteReasons" [(ngModel)]="wasteReason" placeholder="Selecciona razón" [editable]="true"></p-dropdown>
            </div>
        </ng-template>
        <ng-template pTemplate="footer">
            <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideWasteDialog()"></p-button>
            <p-button label="Confirmar" icon="pi pi-check" severity="danger" (onClick)="confirmWaste()"></p-button>
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
  inventoryType: 'meal' | 'ingredient' = 'meal';

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
    this.inventoryService.getItemsByInstance().subscribe(data => this.inventoryItems = data);
  }

  loadMeals() {
    this.mealsService.getItemsByInstance().subscribe(data => this.meals = data);
  }

  openNew() {
    this.item = {};
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
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este item?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.deleteItem(item.id).subscribe(() => {
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

    // Validation
    if (!this.item.stock || !this.selectedUnitMeasure) {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete stock y unidad', life: 3000 });
         return;
    }
    if (this.inventoryType === 'meal' && !this.selectedMeal) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un platillo', life: 3000 });
        return;
    }
    if (this.inventoryType === 'ingredient' && !this.item.name) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese nombre del ingrediente', life: 3000 });
        return;
    }

    this.item.unitMeasureId = this.selectedUnitMeasure.id;
    
    if (this.inventoryType === 'meal') {
        this.item.mealId = this.selectedMeal.id;
        this.item.name = null; 
    } else {
        this.item.mealId = null;
    }

    if (this.item.id) {
    this.inventoryService.updateItem(this.item.id, this.item).subscribe(() => {
        this.loadInventory();
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Item actualizado', life: 3000 });
        this.hideDialog();
    });
    } else {
    this.inventoryService.createItem(this.item).subscribe(() => {
        this.loadInventory();
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Item creado', life: 3000 });
        this.hideDialog();
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
