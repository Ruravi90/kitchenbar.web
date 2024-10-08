import { Base } from "./base.model";
export class Meal extends Base{

    name!: string;
    photo!: string;
    price!: number;
    categoryId!:number;
}
