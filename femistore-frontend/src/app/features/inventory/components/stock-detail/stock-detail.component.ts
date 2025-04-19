import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import type { Stock, StockTrend } from "../../models/stock.model"

import { StockService } from "../../services/stock.service"

@Component({
  selector: "app-stock-detail",
  templateUrl: "./stock-detail.component.html",
  styleUrls: ["./stock-detail.component.css"],
})
export class StockDetailComponent implements OnInit {
  stock?: Stock
  stockTrend?: StockTrend
  predictedDemand?: number
  loading = false
  trendLoading = false
  error = ""

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        const productId = +params["id"]
        this.loadStockDetails(productId)
        this.loadStockTrend(productId)
        this.loadDemandForecast(productId)
      }
    })
  }

  loadStockDetails(productId: number): void {
    this.loading = true
    this.stockService.getStockByProductId(productId).subscribe({
      next: (data) => {
        this.stock = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load stock details"
        console.error(err)
        this.loading = false
      },
    })
  }

  loadStockTrend(productId: number): void {
    this.trendLoading = true
    this.stockService.getStockTrend(productId).subscribe({
      next: (data) => {
        this.stockTrend = data
        this.trendLoading = false
      },
      error: (err) => {
        console.error("Failed to load stock trend", err)
        this.trendLoading = false
      },
    })
  }

  loadDemandForecast(productId: number): void {
    this.stockService.getDemandForecast(productId).subscribe({
      next: (data) => {
        this.predictedDemand = data
      },
      error: (err) => {
        console.error("Failed to load demand forecast", err)
      },
    })
  }

  isLowStock(): boolean {
    return this.stock ? this.stock.stockDisponible <= this.stock.stock_minimum : false
  }

  editStock(): void {
    if (this.stock) {
      this.router.navigate(["/inventory/edit", this.stock.productId])
    }
  }

  viewStockHistory(): void {
    if (this.stock) {
      this.router.navigate(["/inventory/history", this.stock.productId])
    }
  }

  goBack(): void {
    this.router.navigate(["/inventory"])
  }
}
