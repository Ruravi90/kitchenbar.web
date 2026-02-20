import { Base } from "./base.model";
import { Branch } from "./branch.model";
import { Instance } from "./instance.model";

export class Table extends Base {
    name?: string;
    identity?:string;
    additional?:string;
    isRequestAttendace?:boolean;
    isWarnAttendace?:boolean;
    isDangerAttendace?:boolean;
    isRequestCheck?:boolean;
    isWarnCheck?:boolean;
    isDangerCheck?:boolean;
    isBusy?:boolean; // Indicates if table has active orders
    branchId?: number;
    branch?: Branch;
    instance?:Instance;
}
