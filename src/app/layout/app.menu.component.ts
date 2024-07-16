import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Menu',
                items: [
                   
                ]
            },
            {
                label: 'kitchen',
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-check-square', routerLink: ['/kitchen/tables'] },
                    { label: 'Categorias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/kitchen/categories'] },
                ]
            },
            {
                label: 'Configuracion',
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-check-square', routerLink: ['/settings/tables'] },
                    { label: 'Categorias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/categories'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/users'] },
                ]
            }
        ];
    }
}


