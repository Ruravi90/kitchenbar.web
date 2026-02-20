import { Meal } from "./meal.model";

export class Inventory {
    id?: number;
    mealId?: number;
    meal?: Meal;
    name?: string;
    cost?: number;
    stock?: number;
    unitMeasureId?: number;
    // unit_measure?: UnitMeasure; // Assuming UnitMeasure model exists or we ignore for now
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InventoryPrediction {
    inventoryId?: number;
    mealId?: number;
    mealName: string;
    currentStock: number;
    averageDailyConsumption: number;
    predictedConsumption: number;
    suggestedReorder: number;
    daysToPredict: number;
}
