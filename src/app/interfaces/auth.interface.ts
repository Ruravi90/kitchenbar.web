import { Observable } from "rxjs";
import { Category, User } from "../models";

export abstract class AuthInterface{
    abstract login(model: User): Observable<boolean>;
    abstract getToken(): string;
    abstract getCurrentUser(): any;
    abstract checkLogin() : boolean;
}