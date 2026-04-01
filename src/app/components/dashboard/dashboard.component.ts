import { Component, OnInit } from '@angular/core';
import { DashboardInterface, InventoryInterface } from '@kitchenbar/shared-data-access';
import { AuthService } from '@kitchenbar/shared-data-access';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  basicData: any;
  basicOptions: any;
  
  topItemsData: any;
  topItemsOptions: any;

  peakHoursData: any;
  peakHoursOptions: any;

  predictionData: any;
  predictionOptions: any;

  // KPI Data
  loadingKPIs: boolean = true;
  todayRevenue: number = 0;
  revenueTrend: number = 0;
  activeOrders: number = 0;
  completedToday: number = 0;
  avgOrderTime: number = 0;
  customerSatisfaction: number = 95;

  // Chart Loading States
  loadingDailySales: boolean = true;
  loadingTopItems: boolean = true;
  loadingPeakHours: boolean = true;
  loadingPredictions: boolean = true;

  branchId: number = 0;
  instanceId: number = 0; // Capture instanceId from user

  constructor(
    private dashboardService: DashboardInterface,
    private authService: AuthService,
    private inventoryService: InventoryInterface
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
        if (user.branchId) this.branchId = user.branchId;
        if (user.instanceId) this.instanceId = user.instanceId;
    }
    
    // Load data if user has branchId or at least instanceId
    if (this.branchId || this.instanceId) {
      // Use branchId if available, otherwise use 0 (will get all for instance)
      const branchIdToUse = this.branchId || 0;
      
      this.loadKPIData();
      this.loadDashboardData();
    } else {
      console.warn('Dashboard: User has no branchId or instanceId, cannot load data');
      // Set loading to false so skeletons disappear
      this.loadingKPIs = false;
      this.loadingDailySales = false;
      this.loadingTopItems = false;
      this.loadingPeakHours = false;
      this.loadingPredictions = false;
    }

    this.initChartOptions();
  }

  loadKPIData() {
    this.loadingKPIs = true;
    
    // Simulate loading - In production, these would be real API calls
    setTimeout(() => {
      // Mock KPI data - replace with actual API calls
      this.dashboardService.getDailySales(this.branchId).subscribe((data: any) => {
        this.todayRevenue = data.today || 0;
        this.revenueTrend = data.lastWeek > 0 
          ? Math.round(((data.today - data.lastWeek) / data.lastWeek) * 100) 
          : 0;
      });

      // Mock active orders - you'd get this from orders service
      this.activeOrders = 12;
      this.completedToday = 48;
      this.avgOrderTime = 18;
      this.customerSatisfaction = 95;
      
      this.loadingKPIs = false;
    }, 800);
  }

  loadDashboardData() {
    // 1. Daily Sales
    this.loadingDailySales = true;
    this.dashboardService.getDailySales(this.branchId).subscribe({
      next: (data: any) => {
        this.basicData = {
          labels: ['Hoy', 'Semana Pasada'],
          datasets: [
            {
              label: 'Ventas',
              data: [data.today, data.lastWeek],
              backgroundColor: ['rgba(0,129,138,0.25)', 'rgba(186,150,38,0.25)'],
              borderColor: ['#00818A', '#BA9626'],
              borderWidth: 1
            }
          ]
        };
        this.loadingDailySales = false;
      },
      error: (err: any) => {
        console.error('Error loading daily sales:', err);
        this.loadingDailySales = false;
      }
    });

    // 2. Top Selling Items
    this.loadingTopItems = true;
    this.dashboardService.getTopSellingItems(this.branchId).subscribe({
      next: (data: any) => {
        this.topItemsData = {
          labels: data.map((item: any) => item.name),
          datasets: [
            {
              data: data.map((item: any) => item.quantity),
              backgroundColor: [
                  "#00818A",
                  "#BA9626",
                  "#88F640",
                  "#D4AF37",
                  "#005a61"
              ],
              hoverBackgroundColor: [
                  "#009CA6",
                  "#D4AF37",
                  "#66CC20",
                  "#BA9626",
                  "#00818A"
              ]
            }
          ]
        };
        this.loadingTopItems = false;
      },
      error: (err: any) => {
        console.error('Error loading top items:', err);
        this.loadingTopItems = false;
      }
    });

    // 3. Peak Hours
    this.loadingPeakHours = true;
    this.dashboardService.getPeakHours(this.branchId).subscribe({
      next: (data: any) => {
        this.peakHoursData = {
          labels: data.map((item: any) => `${item.hour}:00`),
          datasets: [
            {
              label: 'Órdenes',
              data: data.map((item: any) => item.count),
              backgroundColor: 'rgba(0,129,138,0.7)',
              borderColor: '#00818A',
              borderWidth: 1
            }
          ]
        };
        this.loadingPeakHours = false;
      },
      error: (err: any) => {
        console.error('Error loading peak hours:', err);
        this.loadingPeakHours = false;
      }
    });

    // 4. Inventory Prediction
    this.loadingPredictions = true;
    this.inventoryService.predict(7).subscribe({
      next: (data: any) => {
        // Sort by suggested reorder descending to show most critical first
        const sortedData = data.sort((a: any, b: any) => b.suggestedReorder - a.suggestedReorder).slice(0, 10);

        this.predictionData = {
            labels: sortedData.map((item: any) => item.mealName),
            datasets: [
                {
                    type: 'bar',
                    label: 'Stock Actual',
                    backgroundColor: '#00818A',
                    data: sortedData.map((item: any) => item.currentStock)
                },
                {
                    type: 'bar',
                    label: 'Consumo Predicho (7d)',
                    backgroundColor: '#BA9626',
                    data: sortedData.map((item: any) => item.predictedConsumption)
                },
                {
                    type: 'bar',
                    label: 'Sugerencia Compra',
                    backgroundColor: '#900000',
                    data: sortedData.map((item: any) => item.suggestedReorder)
                }
            ]
        };
        this.loadingPredictions = false;
      },
      error: (err: any) => {
        console.error('Error loading inventory predictions:', err);
        this.loadingPredictions = false;
      }
    });
  }

  initChartOptions() {
    // Use dark colors for white glassmorphism backgrounds
    const textColor = '#1e1e32';
    const textColorSecondary = 'rgba(30, 30, 50, 0.7)';
    const surfaceBorder = 'rgba(30, 30, 50, 0.1)';

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.topItemsOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    this.peakHoursOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    this.predictionOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: false,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                stacked: false,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }
}
