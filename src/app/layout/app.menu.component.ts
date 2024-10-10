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
            this.model.push( {
                label: user.instance!.name_kitchen,
                items: [
                    { label: 'Mesas', icon: 'pi pi-fw pi-check-square', routerLink: ['/kitchen/tables'] },
                    { label: 'Ordenes', icon: 'pi pi-fw pi-check-square', routerLink: ['/kitchen/orders'] },
                ]
            }); 
        
            if(role == 1){
                this.model.push({
                    label: 'Configuración',
                    items: [
                        { label: 'Mesas', icon: 'pi pi-fw pi-check-square', routerLink: ['/settings/tables'] },
                        { label: 'Categorias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/categories'] },
                        { label: 'Alimentos', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/meals'] },
                        { label: 'Sucursales', icon: 'pi pi-fw pi-check-square', routerLink: ['/settings/branches'] },
                        { label: 'Usuarios', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/users'] },
                    ]
                });
            }
        }
        else if( role == 0){
            this.model.push({
                label: 'Administracion',
                items: [
                    { label: 'Licensias', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/licenses'] },
                    { label: 'Instancias', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/instances'] },
                ]
            });
        }

        this.model.push({
            label: 'Perfil',
            items: [
                { label: 'Cerrar sesión',icon: 'pi pi-fw pi-lock', routerLink: ['/auth/loguin'] },
            ]
        });
        
        this.hub.receiveOrderToKitchen().subscribe(x =>  {
            
        });
    }
}


