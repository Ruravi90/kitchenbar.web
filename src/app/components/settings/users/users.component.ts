import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch, User } from '../../../models';
import { AuthInterface, BranchesInterface, UsersInterface, DashboardInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-tables',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  userForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _serviceAuth: AuthInterface,
    private _serviceBranch: BranchesInterface,
    private usersServices: UsersInterface,
    private dashboardService: DashboardInterface
  ){}

  initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      user_name: ['', [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
      email: ['', [Validators.email]],
      phone_number: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      branchId: [null, [Validators.required]],
      role: [null, [Validators.required]]
    });
  }

  items: User[] = [];
  filteredItems: User[] = []; // For search results
  searchTerm: string = '';
  highlightedUserId: number | null = null; // For visual feedback
  
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
    this.initForm();
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
        this.filteredItems = data; // Initialize filtered list
        this.filterUsers(); // Apply any existing search
        this.checkLicenseLimit();
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  // Search functionality
  filterUsers(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredItems = this.items;
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredItems = this.items.filter(user =>
        user.name?.toLowerCase().includes(search) ||
        user.user_name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    }
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
    // Validate form
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'Por favor completa todos los campos requeridos correctamente' 
      });
      return;
    }

    const formValue = this.userForm.value;
    
    // Build user object from form
    this.user.name = formValue.name;
    this.user.user_name = formValue.user_name + '@' + this.current.instance!.name_kitchen!.toLowerCase();
    this.user.email = formValue.email;
    this.user.phone_number = formValue.phone_number;
    this.user.role = formValue.role;
    this.user.branchId = formValue.branchId;
    
    // Only include password if provided
    if (formValue.password) {
      this.user.password = formValue.password;
    }
    
    if(this.isEdit){
      this.usersServices.updateItem(this.user!.id!,this.user).subscribe({
        next: (data) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Éxito!', 
            detail: 'Usuario actualizado correctamente' 
          });
          this.highlightedUserId = this.user.id ?? null;
          this.getUsers();
          setTimeout(() => this.highlightedUserId = null, 2000);
        },
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.usersServices.createItem(this.user).subscribe({
        next: (data) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Éxito!', 
            detail: 'Usuario creado correctamente' 
          });
          this.highlightedUserId = data.id ?? null;
          this.getUsers();
          setTimeout(() => this.highlightedUserId = null, 2000);
        },
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
        header: '¿Confirmar eliminación?',
        message: `¿Estás seguro de eliminar a <strong>${item.name}</strong>?<br>Esta acción no se puede deshacer.`,
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.usersServices.deleteItem(item.id!).subscribe({
            next: (data) => {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Eliminado', 
                detail: `Usuario ${item.name} eliminado correctamente` 
              });
              this.getUsers();
            },
            error: (e) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.messages });
            }
          });
        }
    });
  }
}
