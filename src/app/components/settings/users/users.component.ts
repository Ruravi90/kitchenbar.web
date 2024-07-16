import { Component } from '@angular/core';
import { User } from '../../../models';
import { UsersInterface } from '../../../interfaces';


@Component({
  selector: 'app-tables',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private usersServices: UsersInterface){}

  items?: User[];

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.usersServices.getItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }
}
