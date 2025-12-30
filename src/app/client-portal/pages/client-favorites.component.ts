import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientPortalService } from '../../services/client-portal.service';
import { Observable } from 'rxjs';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';

@Component({
  selector: 'app-client-favorites',
  standalone: true,
  imports: [CommonModule, ClientNavigationComponent],
  templateUrl: './client-favorites.component.html',
  styleUrls: ['./client-favorites.component.css']
})
export class ClientFavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = true;

  constructor(
    private clientService: ClientPortalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.clientService.getFavorites().subscribe({
      next: (res) => {
        this.favorites = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  removeFavorite(branchId: number) {
    if(!confirm('Are you sure you want to remove this from favorites?')) return;

    this.clientService.removeFavorite(branchId).subscribe(() => {
        this.favorites = this.favorites.filter(b => b.id !== branchId);
    });
  }

  orderNow(branch: any) {
    // Navigate to menu using instance identity (not branch identity)
    if (branch.instance?.identity) {
      this.router.navigate(['/menu', branch.instance.identity]);
    } else {
      console.error('Instance identity not available for branch:', branch);
      // Fallback: show error message to user
    }
  }
}
