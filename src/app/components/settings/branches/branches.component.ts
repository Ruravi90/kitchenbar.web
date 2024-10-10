import { Component } from '@angular/core';
import { Branch, Category } from '../../../models';
import { BranchesInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent {
  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private branchsServices: BranchesInterface){}

  branches: Branch[] =[];
  branch: Branch = {};
  visibleModal: boolean = false;
  isEdit:boolean = false;

  ngOnInit(): void {
    this.getbranches();
  }
  getbranches(){
    this.branchsServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.branches = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    })
  }
  showModal(isEdit:boolean = false, item?:Branch){
    this.isEdit = isEdit;
    if(isEdit)
      this.branch = item!;
    else
      this.branch = new Branch();

    this.visibleModal =  true;
  }
  confirmSave(){
    if(this.isEdit){
      this.branchsServices.updateItem(this.branch!.id!,this.branch).subscribe({
        next: (data) => this.getbranches(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.branchsServices.createItem(this.branch).subscribe({
        next: (data) => this.getbranches(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.visibleModal = false;
  }
  confirmDeleted(item:Category) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.branchsServices.deleteItem(this.branch!.id!).subscribe({
            next: (data) => this.getbranches(),
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }
}
