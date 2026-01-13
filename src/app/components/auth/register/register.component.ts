import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { Branch, Instance, User, License } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsersInterface } from '../../../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    user: User = new User();
    branch: Branch = new Branch();
    isBusy: Boolean = false;
    isAuthorized: Boolean | null = null;
    licenses: License[] = [];
    selectedLicenseId: number = 0;

    constructor(
        private uS: AuthService,
        private usersService:  UsersInterface,
        private messageService: MessageService,
        public layoutService:LayoutService,
        private router: Router,
        private http: HttpClient) {
      localStorage.removeItem('user');
    }

    ngOnInit() {
      this.isBusy = false;
      this.user.instance = new Instance();
      this.user.instance.branches = [];
      this.getLicenses();
    }

    getLicenses() {
        this.http.get<License[]>(`${environment.apiBase}Licenses`).subscribe({
            next: (data) => {
                // Filter out internal "Cortesia" plan (ID 1)
                const publicLicenses = data.filter(l => l.id !== 1);

                // Sort: Price 0 (Free Trial) first, then by Price ascending
                this.licenses = publicLicenses.sort((a, b) => {
                    if (a.price === 0) return -1;
                    if (b.price === 0) return 1;
                    return (a.price || 0) - (b.price || 0);
                });

                // Auto-select the first plan (Free Trial)
                if(this.licenses.length > 0) {
                     this.selectedLicenseId = this.licenses[0].id || 0;
                }
            },
            error: (e) => console.error(e)
        });
    }

    toLowerCase(){
        this.user.instance!.name_kitchen = this.user.instance?.name_kitchen?.toLocaleLowerCase();
    }

    addBranche(){
      this.user.instance!.branches?.push(this.branch);
      this.branch = new Branch();
    }

    deleteBranche(index: number){
      this.user.instance!.branches?.splice(index,1);
    }

    register() {
        this.isBusy = true;
        this.user.instance!.licenseId = this.selectedLicenseId;

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
