import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { User } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

    formLogin: FormGroup = new FormGroup({
        user_name: new FormControl(''),
        password: new FormControl('')
      });

    user: User = new User();
    submitted: Boolean = false;
    isAuthorized: Boolean | null = null;
    constructor(
        private uS: AuthService,
        public layoutService:LayoutService, 
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router) {
      localStorage.removeItem('user');
    }
  
    ngOnInit() {
      this.formLogin = this.formBuilder.group(
        {
          user_name: [
            '',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20)
            ]
          ],
          password: [
            '',
            [
              Validators.required,
            ]
          ]
        }
      );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.formLogin.controls; 
    }  
    
    login() {
        this.submitted = true;
        if (this.formLogin.invalid) {
            console.log(this.formLogin)
            return;
        }
        
        this.user.user_name = this.formLogin.controls['user_name'].value;
        this.user.password = this.formLogin.controls['password'].value;
        
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
                this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.messages });
          }
        });
        this.submitted = false;
        this.isAuthorized = false;
    }

    register(){
        this.router.navigate(['/auth/register']);
    }
}
