import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { Stock, StockHistory } from "../../models/stock.model"
import { StockService } from "../../services/stock.service"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-stock-history",
  templateUrl: "./stock-history.component.html",
  styleUrls: ["./stock-history.component.css"],
})
export class StockHistoryComponent implements OnInit {
  productId!: number
  stock?: Stock
  history: StockHistory[] = []
  loading = false
  error = ""
  historyForm!: FormGroup
  showAddForm = false

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.productId = +params["id"]
        this.loadStockDetails()
        this.loadStockHistory()
      }
    })
  }

  initForm(): void {
    this.historyForm = this.fb.group({
      quantityChange: [0, [Validators.required, Validators.min(-1000), Validators.max(1000)]],
      reason: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    })
  }

  loadStockDetails(): void {
    this.loading = true
    this.stockService.getStockByProductId(this.productId).subscribe({
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
    this.stockService.getStockHistory(this.productId).subscribe({
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

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm
    if (this.showAddForm) {
      this.historyForm.reset({
        quantityChange: 0,
        reason: "",
      })
    }
  }

  // Modify the addHistoryEntry method to work with the existing backend
  addHistoryEntry(): void {
    if (this.historyForm.invalid) {
      return
    }

    const quantityChange = this.historyForm.value.quantityChange
    const reason = this.historyForm.value.reason

    // Instead of creating a history entry directly,
    // we'll update the stock quantity which will trigger
    // the backend to record history
    this.loading = true

    if (this.stock) {
      const newQuantity = this.stock.stockDisponible + quantityChange

      // Update stock with new quantity
      this.stockService.updateStock(this.productId, newQuantity).subscribe({
        next: (updatedStock) => {
          this.stock = updatedStock
          // Refresh history (mock data will be returned)
          this.loadStockHistory()
          this.toggleAddForm()
          this.loading = false
        },
        error: (err) => {
          this.error = "Failed to update stock quantity"
          console.error(err)
          this.loading = false
        },
      })
    }
  }

  goBack(): void {
    this.router.navigate(["/inventory/detail", this.productId])
  }

  // Helper method to format dates
  formatDate(date: Date | string): string {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleString()
  }

  // Helper to get CSS class based on quantity change
  getQuantityChangeClass(change: number): string {
    return change > 0 ? "text-success" : change < 0 ? "text-danger" : ""
  }
}
