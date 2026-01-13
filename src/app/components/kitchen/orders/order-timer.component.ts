import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-timer" [ngClass]="'timer-' + severity">
      <i class="pi pi-clock"></i>
      <span class="timer-value">{{displayTime}}</span>
    </div>
  `,
  styles: []
})
export class OrderTimerComponent implements OnInit, OnDestroy {
  @Input() startTime!: string | Date | undefined;
  
  displayTime = '00:00';
  severity: 'success' | 'warning' | 'danger' = 'success';
  private interval: any;

  ngOnInit() {
    if (this.startTime) {
      this.updateTimer();
      this.interval = setInterval(() => this.updateTimer(), 1000);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private updateTimer() {
    if (!this.startTime) return;
    
    const start = new Date(this.startTime).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    this.displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update severity based on elapsed time
    if (minutes > 20) {
      this.severity = 'danger';
    } else if (minutes > 10) {
      this.severity = 'warning';
    } else {
      this.severity = 'success';
    }
  }
}
