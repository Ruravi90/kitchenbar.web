import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthInterface, HubInterface, DashboardInterface } from '../interfaces';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private hub: HubInterface,public layoutService: LayoutService, private auth: AuthInterface, private dashboardService: DashboardInterface) { }

    async ngOnInit() {
        var role =this.auth.getCurrentRol();
        var user =this.auth.getCurrentUser();

        if(role != 0){

            this.model.push( {
                label: user.instance!.name_kitchen,
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-table', routerLink: ['/kitchen/tables'] },
                    { label: 'Ordenes', icon: 'pi pi-fw pi-list', routerLink: ['/kitchen/orders'] },
                ]
            });

            if(role == 1){
                this.model.push( {
                    label: "Panel",
                    items: [
                        { label: 'Graficos', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'] },
                    ]
                });
                this.model.push({
                    label: 'Gestion',
                    items: [
                        { label: 'Mesas', icon: 'pi pi-fw pi-table', routerLink: ['/settings/tables'] },
                        { label: 'Categorías', icon: 'pi pi-fw pi-tags', routerLink: ['/settings/categories'] },
                        { label: 'Alimentos', icon: 'pi pi-fw pi-apple', routerLink: ['/settings/meals'] },
                        { label: 'Sucursales', icon: 'pi pi-fw pi-building', routerLink: ['/settings/branches'] },
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/settings/users'] },
                    ]
                });

                // Check license for Inventory modules
                this.dashboardService.getLicenseStatus(user.instance!.id!).subscribe((license: any) => {
                    if (license && license.features && license.features['inventory_module']) {
                         const inventoryItems: any[] = [
                            { label: 'Gestionar', icon: 'pi pi-fw pi-box', routerLink: ['/inventory'] }
                         ];
                         
                         if (license.features['ai_forecasting']) {
                             inventoryItems.push({ label: 'Predecir', icon: 'pi pi-fw pi-chart-line', routerLink: ['/inventory-prediction'] });
                         }

                this.model.push({
                    label: 'Inventario',
                            items: inventoryItems
                        });
                    }
                });
            }

            await this.delay(1000);

            this.model.push( {
                label: "Configuración",
                items: [
                        { label: 'Datos', icon: 'pi pi-fw pi-table', routerLink: ['/settings/config'] },
                ]
            });
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

    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}


