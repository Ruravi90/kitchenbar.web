import { Component } from '@angular/core';
import { Table } from '../../../models';
import { TablesService } from '../../../services';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {

  constructor(private tableServices: TablesService){}

  tables?: Table[];

  ngOnInit(): void {
    this.retrieveTables();
  }

  retrieveTables(): void {
    this.tableServices.getItems().subscribe({
      next: (data) => {
        this.tables = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
