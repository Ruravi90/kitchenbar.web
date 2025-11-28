import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryPrediction } from '../../services/inventory.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-inventory-prediction',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    CardModule, 
    ButtonModule, 
    InputNumberModule,
    TooltipModule,
    TagModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex flex-wrap justify-content-center">
      <div class="w-full">
        <p-card header="Predicción de Inventario">
          
          <div class="flex align-items-center gap-3 mb-4">
            <label for="days" class="font-medium">Días a predecir:</label>
            <p-inputNumber 
              [(ngModel)]="daysToPredict" 
              [showButtons]="true" 
              buttonLayout="horizontal" 
              inputId="days" 
              spinnerMode="horizontal" 
              [step]="1"
              [min]="1"
              [max]="30"
              decrementButtonClass="p-button-secondary" 
              incrementButtonClass="p-button-secondary" 
              incrementButtonIcon="pi pi-plus" 
              decrementButtonIcon="pi pi-minus">
            </p-inputNumber>
            <p-button 
              label="Actualizar" 
              icon="pi pi-refresh" 
              (onClick)="loadPredictions()">
            </p-button>
          </div>

          <p-table 
            [value]="predictions" 
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 25, 50]"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="mealName">Platillo <p-sortIcon field="mealName"></p-sortIcon></th>
                <th pSortableColumn="currentStock">Stock Actual <p-sortIcon field="currentStock"></p-sortIcon></th>
                <th pSortableColumn="averageDailyConsumption">Consumo Diario Prom. <p-sortIcon field="averageDailyConsumption"></p-sortIcon></th>
                <th pSortableColumn="predictedConsumption">Consumo Predicho <p-sortIcon field="predictedConsumption"></p-sortIcon></th>
                <th pSortableColumn="suggestedReorder">Sugerencia Reorden <p-sortIcon field="suggestedReorder"></p-sortIcon></th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{ item.mealName }}</td>
                <td>{{ item.currentStock }}</td>
                <td>{{ item.averageDailyConsumption }}</td>
                <td>{{ item.predictedConsumption }}</td>
                <td>
                  <p-tag 
                    [value]="item.suggestedReorder > 0 ? item.suggestedReorder.toString() : 'OK'" 
                    [severity]="item.suggestedReorder > 0 ? 'danger' : 'success'"
                    [rounded]="true">
                  </p-tag>
                </td>
                <td>
                  <p-button 
                    icon="pi pi-pencil" 
                    pTooltip="Ajustar Stock" 
                    [rounded]="true" 
                    [outlined]="true" 
                    (onClick)="openAdjustStock(item)">
                  </p-button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="6" class="text-center">No hay predicciones disponibles.</td>
                </tr>
            </ng-template>
          </p-table>

        </p-card>
      </div>
    </div>

    <p-dialog [(visible)]="adjustDialog" header="Ajustar Stock" [modal]="true" [style]="{width: '300px'}">
      <div class="field">
        <label for="newStock" class="block mb-2">Nuevo Stock para {{selectedItem?.mealName}}</label>
        <p-inputNumber id="newStock" [(ngModel)]="newStockValue" [min]="0" class="w-full"></p-inputNumber>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="adjustDialog = false"></p-button>
        <p-button label="Guardar" icon="pi pi-check" [text]="true" (onClick)="saveStock()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `,
  styles: []
})
export class InventoryPredictionComponent implements OnInit {
  predictions: InventoryPrediction[] = [];
  daysToPredict: number = 7;
  
  adjustDialog: boolean = false;
  selectedItem: any = null;
  newStockValue: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadPredictions();
  }

  loadPredictions(): void {
    this.inventoryService.getPredictions(this.daysToPredict).subscribe({
      next: (data) => {
        this.predictions = data;
      },
      error: (err) => {
        console.error('Error loading predictions', err);
      }
    });
  }

  openAdjustStock(item: any) {
    this.selectedItem = item;
    this.newStockValue = item.currentStock;
    this.adjustDialog = true;
  }

  saveStock() {
    if (this.selectedItem) {
      // Necesitamos el ID del inventario, pero el DTO de predicción tiene MealId.
      // Asumiremos que podemos buscar el inventario por MealId o que el endpoint de predicción debería devolver InventoryId.
      // Por ahora, para simplificar y dado que no tenemos InventoryId en el DTO,
      // vamos a hacer un fetch del inventario por MealId (o asumir que el backend lo maneja).
      // CORRECCIÓN: El DTO de predicción NO tiene InventoryId. 
      // Opción A: Agregar InventoryId al DTO.
      // Opción B: Buscar el inventario en el frontend (ineficiente).
      // Vamos a asumir que el usuario quiere actualizar el stock de ese platillo.
      // Necesitamos actualizar el DTO para incluir InventoryId o usar MealId para buscar.
      
      // Para esta iteración, voy a buscar el item de inventario completo usando el servicio (si tuviera un método de búsqueda)
      // O mejor, voy a actualizar el DTO en el backend para incluir InventoryId.
      
      // ... Espera, voy a hacer una llamada rápida para obtener el inventario y luego actualizarlo.
      // Esto es un "hack" rápido, lo ideal es actualizar el DTO.
      
      this.inventoryService.getInventory().subscribe(items => {
        const inventoryItem = items.find(i => i.mealId === this.selectedItem.mealId);
        if (inventoryItem) {
          inventoryItem.stock = this.newStockValue;
          this.inventoryService.updateInventory(inventoryItem.id, inventoryItem).subscribe(() => {
            this.messageService.add({severity:'success', summary:'Stock Actualizado', detail:`Stock de ${this.selectedItem.mealName} actualizado a ${this.newStockValue}`});
            this.adjustDialog = false;
            this.loadPredictions(); // Recargar predicciones
          });
        } else {
             this.messageService.add({severity:'error', summary:'Error', detail:'No se encontró el item de inventario'});
        }
      });
    }
  }
}
