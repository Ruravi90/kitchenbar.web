import { Component } from '@angular/core';
import { Instance, Table } from '../../../models';
import { InstancesService } from '../../../services';


@Component({
  selector: 'app-tables',
  templateUrl: './instances.component.html',
  styleUrl: './instances.component.scss'
})
export class InstancesComponent {

  constructor(private instanceServices: InstancesService){}

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
      error: (e) => console.error(e)
    });
  }
}
