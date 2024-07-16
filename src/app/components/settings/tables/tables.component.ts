import { Component } from '@angular/core';
import { Table } from '../../../models';
import { TablesInterface } from '../../../interfaces';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {

  constructor(private tablesServices: TablesInterface){}

  tables?: Table[];

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.tablesServices.getItems().subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (e) => console.error(e)
    });
  }
}
