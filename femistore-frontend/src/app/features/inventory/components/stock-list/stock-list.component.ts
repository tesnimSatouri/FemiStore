import { Component, OnInit } from "@angular/core"; // Removed 'type' for OnInit
import { Router } from "@angular/router"
import { Stock } from "../../models/stock.model"
import { StockService } from "../../services/stock.service"

@Component({
  selector: "app-stock-list",
  templateUrl: "./stock-list.component.html",
  styleUrls: ["./stock-list.component.css" ],
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = []
  filteredStocks: Stock[] = []
  loading = false
  error = ""
  searchTerm = ""

  constructor(
    private stockService: StockService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadStocks()
  }

  loadStocks(): void {
    this.loading = true
    this.stockService.getStocks().subscribe({
      next: (data) => {
        this.stocks = data
        this.filteredStocks = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load stock data"
        console.error(err)
        this.loading = false
      },
    })
  }

  searchStocks(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStocks = this.stocks
      return
    }

    const term = this.searchTerm.toLowerCase()
    this.filteredStocks = this.stocks.filter(
      (stock) => stock.productName?.toLowerCase().includes(term) || stock.supplierName?.toLowerCase().includes(term),
    )
  }

  viewStockDetails(productId: number): void {
    this.router.navigate(["/inventory/detail", productId])
  }

  editStock(productId: number): void {
    this.router.navigate(["/inventory/edit", productId])
  }

  deleteStock(id: number): void {
    if (confirm("Are you sure you want to delete this stock item?")) {
      this.stockService.deleteStock(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadStocks()
          } else {
            this.error = "Failed to delete stock item"
          }
        },
        error: (err) => {
          this.error = "Failed to delete stock item"
          console.error(err)
        },
      })
    }
  }

  viewStockHistory(productId: number): void {
    this.router.navigate(["/inventory/history", productId])
  }

  isLowStock(stock: Stock): boolean {
    return stock.stockDisponible <= stock.stock_minimum
  }
}
