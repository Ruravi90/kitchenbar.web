import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { Instance, User } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsersInterface } from '../../../interfaces';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent implements OnInit {
    user: User = new User();
    isBusy: Boolean = false;
    isAuthorized: Boolean | null = null;
    constructor(
        private uS: AuthService,
        private usersService:  UsersInterface,
        private messageService: MessageService,
        public layoutService:LayoutService, 
        private router: Router) {
      localStorage.removeItem('user');
    }
  
    ngOnInit() {
      this.isBusy = false;
      this.user.instance = new Instance();
    }

    toLowerCase(){
        this.user.instance!.name_kitchen = this.user.instance?.name_kitchen?.toLocaleLowerCase();
    }
  
    register() {
        this.isBusy = true;
       
        this.uS.register(Object.assign({},this.user)).subscribe({
            next: (resp) => {
            this.isAuthorized = true;
            this.router.navigate(['/kitchen/tables']);
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.messages });
          }
        });

        this.isBusy = false;
        this.isAuthorized = false;
    }
}
