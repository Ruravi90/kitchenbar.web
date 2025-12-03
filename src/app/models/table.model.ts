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
    branchId?: number;
    branch?: Branch;
    instance?:Instance;
}
