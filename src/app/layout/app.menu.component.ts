import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthInterface, HubInterface } from '../interfaces';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private hub: HubInterface,public layoutService: LayoutService, private auth: AuthInterface) { }

    ngOnInit() {
        var role =this.auth.getCurrentRol();
        var user =this.auth.getCurrentUser();

        if(role != 0){

            if(role == 1){
                this.model.push( {
                label: "Panel",
                items: [
                    { label: 'Graficos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'] },
                ]
            });

            }

            this.model.push( {
                label: user.instance!.name_kitchen,
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-table', routerLink: ['/kitchen/tables'] },
                    { label: 'Ordenes', icon: 'pi pi-fw pi-list', routerLink: ['/kitchen/orders'] },
                ]
            });

            if(role == 1){
                this.model.push({
                    label: 'Configuración',
                    items: [
                        { label: 'Mesas', icon: 'pi pi-fw pi-table', routerLink: ['/settings/tables'] },
                        { label: 'Categorías', icon: 'pi pi-fw pi-tags', routerLink: ['/settings/categories'] },
                        { label: 'Alimentos', icon: 'pi pi-fw pi-apple', routerLink: ['/settings/meals'] },
                        { label: 'Sucursales', icon: 'pi pi-fw pi-building', routerLink: ['/settings/branches'] },
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/settings/users'] },
                    ]
                });
                this.model.push({
                    label: 'Inventario',
                    items: [
                        { label: 'Gestionar', icon: 'pi pi-fw pi-box', routerLink: ['/inventory'] },
                        { label: 'Predecir', icon: 'pi pi-fw pi-chart-line', routerLink: ['/inventory-prediction'] },
                    ]
                });
            }
        }
        else if( role == 0){
            this.model.push({
                label: 'Administración',
                items: [
                    { label: 'Licencias', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/licenses'] },
                    { label: 'Instancias', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/instances'] },
                    { label: 'Paquetes', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/packages'] },
                    { label: 'Promociones', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/promotions'] },
                    // { label: 'Membrecías', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/memberships'] },
                ]
            });
        }

        this.model.push({
            label: 'Sesión',
            items: [
              { label: 'Mi cuenta',icon: 'pi pi-fw pi-user', routerLink: ['/settings/account'] },
              { label: 'Cerrar sesión',icon: 'pi pi-fw pi-power-off', routerLink: ['/auth/login'] },
            ]
        });

        this.hub.receiveOrderToKitchen().subscribe(x =>  {

        });
    }
}


