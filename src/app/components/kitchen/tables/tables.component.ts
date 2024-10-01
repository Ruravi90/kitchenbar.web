import { Component } from '@angular/core';
import { Table } from '../../../models';
import { HubInterface, TablesInterface } from '../../../interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  providers: [MessageService]
})
export class TablesComponent {

  constructor(
    private messageService: MessageService,
    private tableServices: TablesInterface, 
    private hub: HubInterface){}

  tables?: Table[];
  isBusyTableService: boolean = false;

  ngOnInit(): void {
    this.retrieveTables();
    this.hub.notificationWarnTables().subscribe(x =>  {
      if(x.isRequestAttendace)
        this.messageService.add({ summary: 'Asistencia', detail: `La ${x.name} necesita ayuda`, life: 3000 });
      if(x.isRequestCheck)
        this.messageService.add({ summary: 'Cuenta', detail: `La ${x.name} solicito la cuenta`, life: 3000 });
      this.retrieveTables();
    });

    this.hub.notificationDangerTables().subscribe(x =>  {
      console.log("notificationWarnAttendace", x);
      this.messageService.add({ summary: 'Asistencia', detail: 'Se solicito asistencia', life: 3000 });
      this.retrieveTables();
    });
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  retrieveTables(): void {
    if(this.isBusyTableService)
      return;

    this.isBusyTableService = true;
    this.tableServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.isBusyTableService = false;
        this.tables = data;
      },
      error: (e) => {
        this.isBusyTableService = false;
      }
    });
  }
}
