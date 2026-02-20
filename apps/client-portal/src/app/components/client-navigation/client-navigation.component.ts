import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="client-nav glass-effect">
      <a routerLink="/client-portal/profile" routerLinkActive="active">Perfil</a>
      <a routerLink="/client-portal/history" routerLinkActive="active">Historial</a>
      <a routerLink="/client-portal/favorites" routerLinkActive="active">Favoritos</a>
    </nav>
  `,
  styles: [`
    .client-nav {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 15px;
      margin-bottom: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.3s;
    }
    a.active {
      background: #FFECB3;
      color: #FF6F00;
      font-weight: 600;
    }
    a:hover:not(.active) {
      background: #f5f5f5;
      color: #333;
    }
  `]
})
export class ClientNavigationComponent {}
