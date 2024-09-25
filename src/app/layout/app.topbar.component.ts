import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthInterface } from '../interfaces';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent  implements OnInit{

    items!: MenuItem[];
    isLogin:boolean=false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        private _serviceAuth: AuthInterface,
        public layoutService: LayoutService
    ) { 
        
    }

    async ngOnInit() {
        this.isLogin = this._serviceAuth.checkLogin();
    }
}
