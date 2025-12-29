import { Inventory } from "./inventory.model";
import { Meal } from "./meal.model";

export class Recipe {
    id?: number;
    mealId?: number;
    inventoryId?: number;
    inventory?: Inventory;
    quantity?: number;
    meal?: Meal;
    createdAt?: Date;
    updatedAt?: Date;
}
