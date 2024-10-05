import { Component } from '@angular/core';
import { Table } from '../../../models';
import { TablesInterface } from '../../../interfaces';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {

  constructor( private confirmationService: ConfirmationService,private tablesServices: TablesInterface){}

  tables: Table[] = [];
  table: Table = {}
  visibleModal: boolean = false;
  isEdit:boolean = false;

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.tablesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (e) => console.error(e)
    });
  }

  showModal(isEdit:boolean = false, item?:Table){
    this.isEdit = isEdit;
    if(isEdit)
      this.table = item!;
    else
      this.table = new Table();

    this.visibleModal =  true;
  }

  confirmSave(){
    if(this.isEdit){
      this.tablesServices.updateItem(this.table!.id!,this.table).subscribe({
        next: (data) => this.getTables(),
        error: (e) => console.error(e)
      });
    }
    else{
      this.tablesServices.createItem(this.table).subscribe({
        next: (data) => this.getTables(),
        error: (e) => console.error(e)
      });
    }
    this.visibleModal = false;
  }

  confirmDeleted(item:Table) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
        }
    });
  }
}
