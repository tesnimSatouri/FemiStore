import { Component, OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { Stock, StockTrend } from "../../models/stock.model"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { StockService } from "../../services/stock.service"

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
  saleForm!: FormGroup
  saleSuccess = false
  saleError = ""

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initSaleForm()
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        const productId = +params["id"]
        this.loadStockDetails(productId)
        this.loadStockTrend(productId)
        this.loadDemandForecast(productId)
      }
    })
  }

  initSaleForm(): void {
    this.saleForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
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

  // New method to process a sale
  processSale(): void {
    if (this.saleForm.invalid || !this.stock) {
      return
    }

    const quantity = this.saleForm.value.quantity
    this.saleSuccess = false
    this.saleError = ""
    this.loading = true

    // First check if stock is sufficient (this will also reduce stock if sufficient)
    this.stockService.isStockSufficient(this.stock.productId, quantity).subscribe({
      next: (isSufficient) => {
        if (isSufficient) {
          // If sufficient, reload stock details to show updated quantity
          this.saleSuccess = true
          this.loadStockDetails(this.stock!.productId)
        } else {
          this.saleError = `Insufficient stock. Only ${this.stock!.stockDisponible} available.`
          this.loading = false
        }
      },
      error: (err) => {
        this.saleError = "Error processing sale"
        console.error(err)
        this.loading = false
      },
    })
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

  // Helper method to calculate days of inventory based on predicted demand
  getDaysOfInventory(): number {
    if (!this.stock || !this.predictedDemand || this.predictedDemand === 0) {
      return 0
    }
    // Predicted demand is for 7 days, so calculate daily demand
    const dailyDemand = this.predictedDemand / 7
    return dailyDemand > 0 ? Math.round(this.stock.stockDisponible / dailyDemand) : 0
  }
  viewStockTrend(id: number) {
    this.router.navigate(['/inventory/trend', id]);
  }
  // Helper to get status class based on days of inventory
  getInventoryStatusClass(): string {
    const days = this.getDaysOfInventory()
    if (days <= 7) return "text-danger"
    if (days <= 14) return "text-warning"
    return "text-success"
  }
}
