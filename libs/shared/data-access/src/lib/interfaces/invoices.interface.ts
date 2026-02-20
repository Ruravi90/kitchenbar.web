import { Observable } from "rxjs";

export abstract class InvoicesInterface {
    abstract generateInvoice(request: any): Observable<any>;
}
