import { Base } from "./base.model";
import { Branch } from "./branch.model";
import { Membership } from "./membership.model";
import { License } from "./license.model";

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
    license?: License;
    branches?:Branch[];
    memberships?: Membership[];
}
