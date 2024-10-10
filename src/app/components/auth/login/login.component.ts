import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { User } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    user: User = new User();
    isBusy: Boolean = false;
    isAuthorized: Boolean | null = null;
    constructor(
        private uS: AuthService,
        public layoutService:LayoutService, 
        private messageService: MessageService,
        private router: Router) {
      localStorage.removeItem('user');
    }
  
    ngOnInit() {
      this.isBusy = false;
    }
  
    login() {
        this.isBusy = true;
        this.uS.login(this.user).subscribe({
            next: (resp) => {
            this.isAuthorized = true;
            if(resp.instanceId != null)
                this.router.navigate(['/kitchen/tables']);
            else
                this.router.navigate(['/admin/licenses']);
          },
          error: (e) => {
            if(e.error.statusCode == 403)
                this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            else if(e.error.statusCode == 401)
                this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Usuario u/o Contraseña incorrectos" });
            else
                this.messageService.add({ severity: 'danger', summary: 'Error', detail: e.error.messages });
          }
        });



        this.isBusy = false;
        this.isAuthorized = false;
    }

    register(){
        this.router.navigate(['/auth/register']);
    }
}
