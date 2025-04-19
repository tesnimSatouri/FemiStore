import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { Stock } from "../../models/stock.model"
import { StockService } from "../../services/stock.service"

@Component({
  selector: "app-low-stock-alert",
  templateUrl: "./low-stock-alert.component.html",
  styleUrls: ["./low-stock-alert.component.css"],
})
export class LowStockAlertComponent implements OnInit {
  lowStockItems: Stock[] = []
  loading = false
  showAlert = true

  constructor(
    private stockService: StockService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLowStockItems()
  }

  loadLowStockItems(): void {
    this.loading = true
    this.stockService.getLowStockItems().subscribe({
      next: (data) => {
        this.lowStockItems = data
        this.loading = false
      },
      error: (err) => {
        console.error("Failed to load low stock items", err)
        this.loading = false
      },
    })
  }

  closeAlert(): void {
    this.showAlert = false
  }

  viewStockDetails(id: number): void {
    this.router.navigate(["/inventory/detail", id])
  }
}
