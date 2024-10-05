import { Base } from "./base.model";
import { Instance } from "./instance.model";
export class User extends Base{
    name?: string;
    phone_number?: string;
    email?: string;
    emailVerifiedAt?: string;
    image?: string;
    password?: string;
    user_name?:string;
    instance?: Instance;
}
