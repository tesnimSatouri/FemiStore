import { Component, OnInit } from "@angular/core"; // Removed 'type' for OnInit
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import type { Stock } from "../../models/stock.model"
import { StockService } from "../../services/stock.service"

@Component({
  selector: "app-stock-form",
  templateUrl: "./stock-form.component.html",
  styleUrls: ["./stock-form.component.css"],
})
export class StockFormComponent implements OnInit {
  stockForm!: FormGroup
  isEditMode = false
  productId?: number
  stockId?: number
  loading = false
  error = ""
  submitted = false
  products: any[] = []
  suppliers: any[] = []

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadProducts()
    this.loadSuppliers()

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true
        this.productId = +params["id"]
        this.loadStockData(this.productId)
      }
    })
  }

  initForm(): void {
    this.stockForm = this.fb.group({
      productId: ["", Validators.required],
      stockDisponible: ["", [Validators.required, Validators.min(0)]],
      stock_minimum: ["", [Validators.required, Validators.min(0)]],
      fournisseur_id: ["", Validators.required],
    })
  }

  loadProducts(): void {
    this.stockService.getProducts().subscribe({
      next: (products) => {
        this.products = products
      },
      error: (err) => {
        console.error("Failed to load products", err)
      },
    })
  }

  loadSuppliers(): void {
    this.stockService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers
      },
      error: (err) => {
        console.error("Failed to load suppliers", err)
      },
    })
  }

  loadStockData(productId: number): void {
    this.loading = true
    this.stockService.getStockByProductId(productId).subscribe({
      next: (stock) => {
        this.stockId = stock.id_stock
        this.stockForm.patchValue({
          productId: stock.productId,
          stockDisponible: stock.stockDisponible,
          stock_minimum: stock.stock_minimum,
          fournisseur_id: stock.fournisseur_id,
        })
        this.error = ""
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load stock data"
        console.error(err)
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    this.submitted = true

    if (this.stockForm.invalid) {
      return
    }

    this.loading = true

    const stockData: Stock = {
      ...this.stockForm.value,
    }

    if (this.isEditMode && this.productId) {
      // For edit mode, we use the updateStock method which requires productId and quantity
      this.stockService.updateStock(this.productId, stockData.stockDisponible).subscribe({
        next: () => {
          this.error = ""
          this.loading = false
          this.router.navigate(["/inventory"])
        },
        error: (err) => {
          this.error = "Failed to update stock"
          console.error(err)
          this.loading = false
        },
      })
    } else {
      this.stockService.addStock(stockData).subscribe({
        next: () => {
          this.error = ""
          this.loading = false
          this.router.navigate(["/inventory"])
        },
        error: (err) => {
          this.error = "Failed to add stock"
          console.error(err)
          this.loading = false
        },
      })
    }
  }

  // Helper getter for form controls
  get f() {
    return this.stockForm.controls
  }

  getProductName(id: number): string {
    const product = this.products.find((p) => p.id === id)
    return product ? product.name : ""
  }

  getSupplierName(id: number): string {
    const supplier = this.suppliers.find((s) => s.id === id)
    return supplier ? supplier.name : ""
  }
}
