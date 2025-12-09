import { Observable } from 'rxjs';

export abstract class DashboardInterface {
  abstract getDailySales(branchId: number): Observable<any>;
  abstract getTopSellingItems(branchId: number): Observable<any[]>;
  abstract getPeakHours(branchId: number): Observable<any[]>;
  abstract getLicenseStatus(instanceId?: number): Observable<any>;
}
