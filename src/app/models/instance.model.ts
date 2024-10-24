import { Base } from "./base.model";
import { Branch } from "./branch.model";
export class Instance{
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    name?: string;
    name_client?: string;
    correo?:string;
    name_kitchen?: string;
    identity?:string;
    licenseId?:number;
    branches?:Branch[];
}
