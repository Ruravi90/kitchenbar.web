import { Base } from "./base.model";
import { Diner } from "./diner.model";
import { Meal } from "./meal.model";
import { Table } from "./table.model";
export class Order extends Base{

    mealId?: number;
    meal?:Meal;
    tableId?:number;
    table?:Table;
    dinerId?:number;
    diner?:Diner;
    quantity?: number;
    aditional?:string;
    isCancel?:boolean = false;
    isPay?:boolean = false;
    statusOrderId?: number = 1;
}
