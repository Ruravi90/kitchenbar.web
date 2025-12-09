import { Component } from '@angular/core';
import { Branch, User } from '../../../models';
import { AuthInterface, BranchesInterface, UsersInterface, DashboardInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-tables',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor( private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _serviceAuth: AuthInterface,
    private _serviceBranch: BranchesInterface,
    private usersServices: UsersInterface,
    private dashboardService: DashboardInterface){}

  items: User[] = [];
  branches:Branch[] =[];
  selectedBranche:any;
  user: User = new User();
  current:User = new User();
  visibleModal: boolean = false;
  isEdit: boolean = false;
  roles:any[] = [
    {
      id:1,
      name:'Admin'
    },
    {
      id:2,
      name:'Mesero'
    },
  ];
  selectedRol:any;

  ngOnInit(): void {
    this.getUsers();
    this.getBranches();
    this.current = this._serviceAuth.getCurrentUser();
  }

  canCreateUsers: boolean = true;
  maxUsers: number = -1;

  getUsers(): void {
    this.usersServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
        this.checkLicenseLimit();
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  checkLicenseLimit() {
      this.dashboardService.getLicenseStatus().subscribe((license: any) => {
          if (license) {
              this.maxUsers = license.maxUsers === 'Unlimited' ? -1 : parseInt(license.maxUsers);
              if (this.maxUsers !== -1 && this.items.length >= this.maxUsers) {
                  this.canCreateUsers = false;
              } else {
                  this.canCreateUsers = true;
              }
          }
      });
  }
  getBranches(): void {
    this._serviceBranch.getItemsByInstance().subscribe({
      next: (data) => {
        this.branches = data;
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  showModal(isEdit:boolean = false, item?:User){
    this.selectedRol = null;
    this.selectedBranche = null;
    if(isEdit){
      this.user = item!;
      this.user.user_name = item?.user_name?.split('@')[0];
      this.user.password = "";
      this.selectedRol = this.roles.find(i=> i.id == item?.role);
      this.selectedBranche = this.branches.find(i=> i.id == item?.branchId);
      console.log(this.selectedRol );
    }else
      this.user = new User();

    this.isEdit = isEdit;
    this.visibleModal =  true;
  }

  confirmSave(){
    this.user.user_name = this.user.user_name +'@'+ this.current.instance!.name_kitchen!.toLowerCase();
    this.user.role = this.selectedRol.id;
    this.user.branchId = this.selectedBranche.id;
    if(this.isEdit){
      this.usersServices.updateItem(this.user!.id!,this.user).subscribe({
        next: (data) => this.getUsers(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.usersServices.createItem(this.user).subscribe({
        next: (data) => this.getUsers(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.selectedRol = null;
    this.selectedBranche = null;
    this.visibleModal = false;
  }

  confirmDeleted(item:User) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.usersServices.deleteItem(this.user.id!).subscribe({
            next: (data) => this.getUsers(),
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }
}
