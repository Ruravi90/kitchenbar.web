import { Component, OnInit } from '@angular/core';
import { DashboardInterface } from '../../interfaces/dashboard.interface';
import { AuthService } from '../../services/auth.service';

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

  branchId: number = 0;
  instanceId: number = 0; // Capture instanceId from user

  constructor(
    private dashboardService: DashboardInterface,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
        if (user.branchId) this.branchId = user.branchId;
        if (user.instanceId) this.instanceId = user.instanceId;
    }
    
    if (this.branchId) {
      this.loadDashboardData();
    }

    this.initChartOptions();
  }

  loadDashboardData() {
    // 1. Daily Sales
    this.dashboardService.getDailySales(this.branchId).subscribe(data => {
      this.basicData = {
        labels: ['Hoy', 'Semana Pasada'],
        datasets: [
          {
            label: 'Ventas',
            data: [data.today, data.lastWeek],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
            borderWidth: 1
          }
        ]
      };
    });

    // 2. Top Selling Items
    this.dashboardService.getTopSellingItems(this.branchId).subscribe(data => {
      this.topItemsData = {
        labels: data.map(item => item.name),
        datasets: [
          {
            data: data.map(item => item.quantity),
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            hoverBackgroundColor: [
                "#64B5F6",
                "#81C784",
                "#FFB74D",
                "#4DD0E1",
                "#9575CD"
            ]
          }
        ]
      };
    });

    // 3. Peak Hours
    this.dashboardService.getPeakHours(this.branchId).subscribe(data => {
      this.peakHoursData = {
        labels: data.map(item => `${item.hour}:00`),
        datasets: [
          {
            label: 'Órdenes',
            data: data.map(item => item.count),
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1
          }
        ]
      };
    });
  }

  initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
  }
}
