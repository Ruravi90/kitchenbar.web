import { Observable } from "rxjs";
import { Category, User } from "../models";

export abstract class AuthInterface{
    abstract login(model: User): Observable<User>;
    abstract getToken(): string;
    abstract getCurrentUser(): any;
    abstract checkLogin() : boolean;
    abstract getCurrentRol():number;
}