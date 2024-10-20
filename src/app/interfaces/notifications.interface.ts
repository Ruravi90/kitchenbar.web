import { Observable } from "rxjs";
import { Category, User } from "../models";

export abstract class NotificationsInterface{
    abstract send(VapidDetails:any): Observable<any>;
}