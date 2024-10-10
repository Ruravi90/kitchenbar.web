import { Component } from '@angular/core';
import { Instance, Table } from '../../../models';
import { InstancesService } from '../../../services';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-tables',
  templateUrl: './instances.component.html',
  styleUrl: './instances.component.scss'
})
export class InstancesComponent {

  constructor(private messageService: MessageService,private instanceServices: InstancesService){}

  items?: Instance[];

  ngOnInit(): void {
    this.retrieveTables();
  }

  retrieveTables(): void {
    this.instanceServices.getItems().subscribe({
      next: (data) => {
        this.items = data;
        console.log(data);
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }
}
