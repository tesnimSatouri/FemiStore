import { Component, OnInit } from "@angular/core"; // Removed 'type' for OnInit
import { ActivatedRoute, Router } from "@angular/router"
import type { Stock, StockHistory } from "../../models/stock.model"
import { StockService } from "../../services/stock.service"

@Component({
  selector: "app-stock-history",
  templateUrl: "./stock-history.component.html",
  styleUrls: ["./stock-history.component.css"],
})
export class StockHistoryComponent implements OnInit {
  stockId!: number
  stock?: Stock
  history: StockHistory[] = []
  loading = false
  error = ""

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.stockId = +params["id"]
        this.loadStockDetails()
        this.loadStockHistory()
      }
    })
  }

  loadStockDetails(): void {
    this.loading = true
    this.stockService.getStockByProductId(this.stockId).subscribe({
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

  loadStockHistory(): void {
    this.loading = true
    this.stockService.getStockHistory(this.stockId).subscribe({
      next: (data) => {
        this.history = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load stock history"
        console.error(err)
        this.loading = false
      },
    })
  }

  goBack(): void {
    this.router.navigate(["/inventory/detail", this.stockId])
  }
}
