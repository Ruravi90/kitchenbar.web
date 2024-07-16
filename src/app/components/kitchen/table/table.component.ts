import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import {MealsInterface} from "../../../interfaces"
import { Meal } from '../../../models';

@Component({
    selector: 'app-login',
    templateUrl: './table.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class TableComponent implements OnInit{

    selectedItem!: string;
    suggestions!: any[];
    meals!:any[];
    products: any[] = [];

    constructor(public layoutService: LayoutService, public mealsService: MealsInterface) { }

    ngOnInit(): void {
       this.mealsService.getItems().subscribe(resutl=>{
        this.meals = resutl;
       });
    }

    search(event:AutoCompleteCompleteEvent){
        this.suggestions = this.meals.filter((str) => 
            str.name.toLowerCase().includes(event.query.toLowerCase())
        );
    }

    selectProduct(event : AutoCompleteSelectEvent){
        console.log(event);
        this.products.push(event.value);
        this.selectedItem = "";
    }
}
