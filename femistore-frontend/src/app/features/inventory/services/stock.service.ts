import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"
import { Stock, StockHistory, StockTrend } from "../models/stock.model"
import { environment } from "../../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class StockService {
  private apiUrl = `${environment.inventoryServiceUrl}/api/stock`

  private mockProducts = [
    { id: 1, name: "Robe Rouge" },
    { id: 2, name: "Sac à main" },
    { id: 3, name: "Collier Argent" },
    { id: 4, name: "Chaussures Noires" },
    { id: 5, name: "Bracelet Or" },
  ]

  private mockSuppliers = [
    { id: 101, name: "Fashion Supplier" },
    { id: 102, name: "Accessories Inc" },
    { id: 103, name: "Footwear Ltd" },
  ]

  constructor(private http: HttpClient) {}

  // Get all stock items
  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}`).pipe(
      map((stocks) => this.enrichStocksWithNames(stocks)),
      catchError(this.handleError<Stock[]>("getStocks", [])),
    )
  }

  // Get stock by product ID
  getStockByProductId(productId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${productId}`).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>(`getStock productId=${productId}`)),
    )
  }

  // Alias for compatibility
  getStockById(productId: number): Observable<Stock> {
    return this.getStockByProductId(productId)
  }

  // Check if stock is sufficient
  isStockSufficient(productId: number, quantity: number): Observable<boolean> {
    const params = new HttpParams().set("quantity", quantity.toString())
    return this.http.get<boolean>(`${this.apiUrl}/${productId}/check`, { params }).pipe(
      tap((isSufficient) => {
        console.log(
          `Stock check for product ${productId}, quantity ${quantity}: ${isSufficient ? "Sufficient" : "Insufficient"}`,
        )
        // If sufficient, the backend will automatically reduce the stock and record history
      }),
      catchError(this.handleError<boolean>(`checkStock productId=${productId}`, false)),
    )
  }

  // Add new stock
  addStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}`, stock).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>("addStock")),
    )
  }

  // Update stock
  updateStock(productId: number, quantity: number): Observable<Stock> {
    const params = new HttpParams().set("quantity", quantity.toString())
    return this.http.put<Stock>(`${this.apiUrl}/${productId}`, null, { params }).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>("updateStock")),
    )
  }

  // Delete stock
  deleteStock(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: "text" }).pipe(
      map(() => true),
      catchError(this.handleError<boolean>("deleteStock", false)),
    )
  }

  // Get stock trend analysis
  getStockTrend(productId: number): Observable<StockTrend> {
    return this.http
      .get<StockTrend>(`${this.apiUrl}/${productId}/trend`)
      .pipe(catchError(this.handleError<StockTrend>(`getStockTrend productId=${productId}`)))
  }

  // Get demand forecast
  getDemandForecast(productId: number): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/${productId}/demand-forecast`)
      .pipe(catchError(this.handleError<number>(`getDemandForecast productId=${productId}`, 0)))
  }

  // Get low stock items
  getLowStockItems(): Observable<Stock[]> {
    return this.getStocks().pipe(
      map((stocks) => stocks.filter((stock) => stock.stockDisponible <= stock.stock_minimum)),
      catchError(this.handleError<Stock[]>("getLowStockItems", [])),
    )
  }

  // Get stock history - Using mock data since there's no direct endpoint
  getStockHistory(productId: number): Observable<StockHistory[]> {
    console.log(`Getting mock history for product ${productId}`)
    // Use mock data since there's no direct endpoint
    const mockHistory: StockHistory[] = [
      { id: 1, productId: productId, quantityChange: 2, timestamp: new Date(2024, 1, 15), reason: "Restock" },
      { id: 2, productId: productId, quantityChange: -1, timestamp: new Date(2024, 1, 10), reason: "Order #1234" },
      { id: 3, productId: productId, quantityChange: -2, timestamp: new Date(2024, 1, 5), reason: "Order #1235" },
    ]
    return of(mockHistory)
  }

  // Add stock history entry
  addStockHistory(stockHistory: StockHistory): Observable<StockHistory> {
    console.log("History will be recorded by backend during stock update")
    // Just return the input as if it was successful
    // The actual history recording happens in the backend's updateStock method
    return of(stockHistory)
  }

  // Helpers to enrich stock data
  private enrichStocksWithNames(stocks: Stock[]): Stock[] {
    return stocks.map((stock) => this.enrichStockWithNames(stock))
  }

  private enrichStockWithNames(stock: Stock): Stock {
    const product = this.mockProducts.find((p) => p.id === stock.productId)
    const supplier = this.mockSuppliers.find((s) => s.id === stock.fournisseur_id)

    return {
      ...stock,
      productName: product ? product.name : `Product ${stock.productId}`,
      supplierName: supplier ? supplier.name : `Supplier ${stock.fournisseur_id}`,
    }
  }

  // Error handler
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  // Mock methods for products and suppliers
  getProducts(): Observable<any[]> {
    return of(this.mockProducts)
  }

  getSuppliers(): Observable<any[]> {
    return of(this.mockSuppliers)
  }
}
