import { Base } from "./base.model";
import { Instance } from "./instance.model";
import { License } from "./license.model";

export interface Membership extends Base {
    instance?: Instance;
    licenseId: number;
    license?: License;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
    status?: string; // "Active", "Expired", "Cancelled"
}
