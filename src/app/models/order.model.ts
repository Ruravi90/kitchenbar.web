import { Base } from "./base.model";
import { Meal } from "./meal.model";
import { Table } from "./table.model";
export class Order extends Base{

    mealId?: number;
    meal?:Meal;
    tableId?:number;
    table?:Table;
    quantity?: number;
    aditional?:string;
    isCancel?:boolean = false;
    statusOrderId?: number = 1;
}
