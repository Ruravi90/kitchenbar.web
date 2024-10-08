import { Component } from '@angular/core';
import { ImportModules } from '../../app.imports'
import { TablesService } from '../../services/index';
import { Table } from '../../models/index';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [ImportModules],
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
