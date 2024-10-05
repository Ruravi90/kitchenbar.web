import { Component } from '@angular/core';
import { User } from '../../../models';
import { AuthInterface, UsersInterface } from '../../../interfaces';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-tables',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor( private confirmationService: ConfirmationService,
    private _serviceAuth: AuthInterface,
    private usersServices: UsersInterface){}

  items: User[] = [];
  user: User = new User();
  current:User = new User();
  visibleModal: boolean = false;
  isEdit: boolean = false;

  ngOnInit(): void {
    this.getUsers();
    this.current = this._serviceAuth.getCurrentUser();
  }

  getUsers(): void {
    this.usersServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }

  showModal(isEdit:boolean = false, item?:User){
    if(isEdit){
      this.user = item!;
      this.user.user_name = item?.user_name?.split('@')[0];
    }else
      this.user = new User();

    this.isEdit = isEdit;
    this.visibleModal =  true;
  }

  confirmSave(){
    if(this.isEdit){
      this.usersServices.updateItem(this.user!.id!,this.user).subscribe({
        next: (data) => this.getUsers(),
        error: (e) => console.error(e)
      });
    }
    else{
      this.usersServices.createItem(this.user).subscribe({
        next: (data) => this.getUsers(),
        error: (e) => console.error(e)
      });
    }
    this.visibleModal = false;
  }

  confirmDeleted(item:User) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
        }
    });
  }
}
