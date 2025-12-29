import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientPortalService } from '../../services/client-portal.service';
import { Observable } from 'rxjs';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [CommonModule, ClientNavigationComponent],
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.css']
})
export class ClientHistoryComponent implements OnInit {
  orders$: Observable<any[]> | undefined;

  constructor(private clientService: ClientPortalService) {}

  ngOnInit() {
    this.orders$ = this.clientService.getHistory();
  }

  getOrderStatusColor(status: string): string {
    switch(status?.toLowerCase()) {
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
  }
}
