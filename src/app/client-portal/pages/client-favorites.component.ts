import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private clientService: ClientPortalService) {}

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
}
