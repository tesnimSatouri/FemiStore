import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockTrend } from '../../models/stock.model';
import { StockService } from '../../services/stock.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stock-trend',
  templateUrl: './stock-trend.component.html',
  styleUrls: ['./stock-trend.component.css'],
})
export class StockTrendComponent implements OnInit {
  productId!: number;
  stockTrend?: StockTrend;
  predictedDemand?: number;
  loading = false;
  error = '';

  constructor(
    private  stockService: StockService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loading = true;
        forkJoin({
          trend: this.stockService.getStockTrend(this.productId),
          demand: this.stockService.getDemandForecast(this.productId),
        }).subscribe({
          next: ({ trend, demand }) => {
            this.stockTrend = trend;
            this.predictedDemand = demand;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load stock trend or demand forecast';
            console.error(err);
            this.loading = false;
          },
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/inventory/detail', this.productId]);
  }

  // Helper to translate backend trend values for display
  getTrendDisplay(trend: string): string {
    switch (trend) {
      case 'décroissant':
        return 'Decreasing';
      case 'stable':
        return 'Stable';
      case 'croissant':
        return 'Increasing';
      default:
        return trend;
    }
  }

  // Helper to get badge class based on trend
  getTrendBadgeClass(trend: string): string {
    switch (trend) {
      case 'décroissant':
        return 'bg-danger';
      case 'stable':
        return 'bg-warning';
      case 'croissant':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}