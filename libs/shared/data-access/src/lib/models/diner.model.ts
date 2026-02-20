
export class Diner{
    id?:number;
    name_client?:string;
    correo?:string;
    phone_number?:string;
    tableId?:number;
    isPay?:boolean;
    orderType?: OrderType;
    pickupTime?: Date;
    deliveryAddress?: string;
    loyaltyMemberId?: number;
}

export enum OrderType {
    DineIn = 0,
    Delivery = 1,
    Pickup = 2
}
