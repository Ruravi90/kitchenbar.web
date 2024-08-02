import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { User } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';

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
    constructor(private uS: AuthService,public layoutService:LayoutService, private router: Router) {
      localStorage.removeItem('user');
    }
  
    ngOnInit() {
      this.isBusy = false;
    }
  
    login() {
        this.isBusy = true;
        this.uS.login(this.user).subscribe(resp=>{
            this.isAuthorized = true;
            this.router.navigate(['/kitchen/tables']);
        });

        this.isBusy = false;
        this.isAuthorized = false;
    }
}
