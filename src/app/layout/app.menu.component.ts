import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { HubInterface } from '../interfaces';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private hub: HubInterface,public layoutService: LayoutService) { }

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
                    { label: 'Ordenes', icon: 'pi pi-fw pi-check-square', routerLink: ['/kitchen/orders'] },
                ]
            },
            {
                label: 'Configuracion',
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-check-square', routerLink: ['/settings/tables'] },
                    { label: 'Categorias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/categories'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/users'] },
                ]
            },
            {
                label: 'Administracion',
                items: [
                    { label: 'Licensias', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/licenses'] },
                    { label: 'Instancias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/instances'] },
                ]
            }
        ];
        
        this.hub.receiveOrderToKitchen().subscribe(x =>  {
            
        });
    }
}


