import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientPortalService } from '../../services/client-portal.service';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-favorites',
  standalone: true,
  imports: [
    CommonModule,
    ClientNavigationComponent,
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
    CardModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './client-favorites.component.html',
  styleUrls: ['./client-favorites.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ClientFavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = false;
  sortBy: string = 'recent';

  sortOptions = [
    { label: 'Más recientes', value: 'recent' },
    { label: 'Nombre', value: 'name' },
    { label: 'Más visitados', value: 'visits' }
  ];

  constructor(
    private clientService: ClientPortalService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.clientService.getFavorites().subscribe({
      next: (favorites: any) => {
        this.favorites = favorites;
        this.sortFavorites();
        this.isLoading =false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudieron cargar los favoritos'
        });
        this.isLoading = false;
      }
    });
  }

  sortFavorites() {
    switch (this.sortBy) {
      case 'name':
        this.favorites.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'visits':
        this.favorites.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      case 'recent':
      default:
        this.favorites.sort((a, b) => {
          const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }
  }

  onSortChange() {
    this.sortFavorites();
  }

  goToMenu(favorite: any) {
    this.router.navigate(['/menu', favorite.instance?.identity]);
  }

  removeFavorite(favorite: any) {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar "${favorite.name}" de tus favoritos?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.removeFavorite(favorite.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `${favorite.name} eliminado de favoritos`
            });
            this.loadFavorites();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'No se pudo eliminar de favoritos'
            });
          }
        });
      }
    });
  }

  formatLastVisit(lastVisit: string | null): string {
    if (!lastVisit) return 'Sin visitas previas';
    
    const date = new Date(lastVisit);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString();
  }
}
