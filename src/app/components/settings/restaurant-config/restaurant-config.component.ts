import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RestaurantConfigService } from '../../../services/restaurant-config.service';
import { RestaurantConfig } from '../../../models/restaurant-config.model';
import { ActivatedRoute } from '@angular/router';
import { DashboardInterface } from '../../../interfaces';

@Component({
  selector: 'app-restaurant-config',
  templateUrl: './restaurant-config.component.html',
  styleUrls: ['./restaurant-config.component.scss']
})
export class RestaurantConfigComponent implements OnInit {

  config: RestaurantConfig = new RestaurantConfig();
  loading: boolean = false;
  
  stripeStatus: any = null;
  loadingStripe: boolean = false;

  // License Logic
  licenseData: any = null;
  featureMapping: { [key: string]: string } = {
      'inventory_module': 'Control de Inventario',
      'ai_forecasting': 'Predicción con IA',
      'max_tables': 'Límite de Mesas',
      'max_users': 'Límite de Usuarios',
      'api_access': 'Acceso a API',
      'kitchen_display': 'Pantalla de Cocina (KDS)',
      'multi_branch_management': 'Gestión Multi-Sucursal',
      'online_payments': 'Pagos en Línea',
      'qr_menu': 'Menú QR',
      'reporting': 'Reportes Avanzados'
  };

  constructor(
    private service: RestaurantConfigService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private dashboardService: DashboardInterface // Inject DashboardInterface
  ) { }

  ngOnInit(): void {
    this.loadConfig();
    this.checkStripeStatus();
    this.loadLicenseStatus(); // Load license
    
    // Check for success param from Stripe redirect
    this.route.queryParams.subscribe(params => {
        if(params['success']) {
             this.messageService.add({severity: 'success', summary: 'Conexión Exitosa', detail: 'Tu cuenta de Stripe se ha conectado correctamente.'});
             // Clear query param to avoid repeat message? (Optional)
        }
    });
  }

  loadLicenseStatus() {
      this.dashboardService.getLicenseStatus().subscribe(data => {
          this.licenseData = data;
      });
  }

  getFeatureName(key: string): string {
      return this.featureMapping[key] || key;
  }

  loadConfig() {
    this.loading = true;
    this.service.getConfig().subscribe({
      next: (data) => {
        this.config = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        // 404 is expected if not configured yet, just ignore or handle defaults
      }
    });
  }

  save() {
    this.loading = true;
    this.service.updateConfig(this.config).subscribe({
      next: (data) => {
        this.config = data;
        this.loading = false;
        this.messageService.add({severity: 'success', summary: 'Guardado', detail: 'Configuración actualizada.'});
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo guardar la configuración.'});
      }
    });
  }

  checkStripeStatus() {
      this.loadingStripe = true;
      this.service.getStripeStatus().subscribe({
          next: (status) => {
              this.stripeStatus = status;
              this.loadingStripe = false;
          },
          error: (err) => {
              console.error(err);
              this.loadingStripe = false;
          }
      });
  }

  connectStripe() {
      this.loadingStripe = true;
      this.service.onboardStripe().subscribe({
          next: (response) => {
              // Redirect to Stripe
              window.location.href = response.url;
          },
          error: (err) => {
              console.error(err);
              this.loadingStripe = false;
              const msg = err.error?.message || 'No se pudo iniciar la conexión con Stripe.';
              this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
          }
      });
  }
}
