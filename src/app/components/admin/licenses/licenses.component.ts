import { Component } from '@angular/core';
import { License, Table } from '../../../models';
import { LicensesService } from '../../../services';


@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss'
})
export class LicensesComponent {

  constructor(private licenseServices: LicensesService){}

  items?: License[];

  ngOnInit(): void {
    this.retrieveTables();
  }

  retrieveTables(): void {
    this.licenseServices.getItems().subscribe({
      next: (data) => {
        this.items = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
