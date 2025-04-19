import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http"; // Removed 'type'
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Stock, StockHistory, StockTrend } from "../models/stock.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StockService {
  private apiUrl = `${environment.apiUrl}`; // Adjusted to match backend

  // Mock product and supplier data (until those APIs are available)
  private mockProducts = [
    { id: 1, name: "Robe Rouge" },
    { id: 2, name: "Sac à main" },
    { id: 3, name: "Collier Argent" },
    { id: 4, name: "Chaussures Noires" },
    { id: 5, name: "Bracelet Or" },
  ];

  private mockSuppliers = [
    { id: 101, name: "Fashion Supplier" },
    { id: 102, name: "Accessories Inc" },
    { id: 103, name: "Footwear Ltd" },
  ];

  constructor(private http: HttpClient) {}

  // Get all stock items
  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/GetAllProducts`).pipe(
      map((stocks) => this.enrichStocksWithNames(stocks)),
      catchError(this.handleError<Stock[]>("getStocks", []))
    );
  }

  // Get stock by product ID
  getStockByProductId(productId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/GetById/${productId}`).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>(`getStock productId=${productId}`))
    );
  }

  // For compatibility with existing components
  getStockById(productId: number): Observable<Stock> {
    return this.getStockByProductId(productId);
  }

  // Check if stock is sufficient
  isStockSufficient(productId: number, quantity: number): Observable<boolean> {
    const params = new HttpParams().set("quantity", quantity.toString());
    return this.http
      .get<boolean>(`${this.apiUrl}/check`, { params }) // Adjust endpoint as needed
      .pipe(catchError(this.handleError<boolean>(`checkStock productId=${productId}`, false)));
  }

  // Add new stock
  addStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/AddProduct`, stock).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>("addStock"))
    );
  }

  // Update stock
  updateStock(productId: number, quantity: number): Observable<Stock> {
    const params = new HttpParams().set("quantity", quantity.toString());
    return this.http.put<Stock>(`${this.apiUrl}/UpdateProduct/${productId}`, null, { params }).pipe(
      map((stock) => this.enrichStockWithNames(stock)),
      catchError(this.handleError<Stock>("updateStock"))
    );
  }

  // Delete stock
  deleteStock(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/RemoveProduct/${id}`, { responseType: "text" }).pipe(
      map(() => true),
      catchError(this.handleError<boolean>("deleteStock", false))
    );
  }

  // Get stock trend analysis (mock until backend API is ready)
  getStockTrend(productId: number): Observable<StockTrend> {
    return this.http
      .get<StockTrend>(`${this.apiUrl}/trend`) // Adjust endpoint as needed
      .pipe(catchError(this.handleError<StockTrend>(`getStockTrend productId=${productId}`)));
  }

  // Get demand forecast (mock until backend API is ready)
  getDemandForecast(productId: number): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/demand-forecast`) // Adjust endpoint as needed
      .pipe(catchError(this.handleError<number>(`getDemandForecast productId=${productId}`, 0)));
  }

  // Get low stock items
  getLowStockItems(): Observable<Stock[]> {
    return this.getStocks().pipe(
      map((stocks) => stocks.filter((stock) => stock.stockDisponible <= stock.stock_minimum)),
      catchError(this.handleError<Stock[]>("getLowStockItems", []))
    );
  }

  // Get stock history (mock implementation)
  getStockHistory(stockId: number): Observable<StockHistory[]> {
    const mockHistory: StockHistory[] = [
      { id: 1, productId: stockId, quantityChange: 2, timestamp: new Date(2024, 1, 15), reason: "Restock" },
      { id: 2, productId: stockId, quantityChange: -1, timestamp: new Date(2024, 1, 10), reason: "Order #1234" },
      { id: 3, productId: stockId, quantityChange: -2, timestamp: new Date(2024, 1, 5), reason: "Order #1235" },
    ];
    return of(mockHistory);
  }

  // Helper methods to enrich stock data
  private enrichStocksWithNames(stocks: Stock[]): Stock[] {
    return stocks.map((stock) => this.enrichStockWithNames(stock));
  }

  private enrichStockWithNames(stock: Stock): Stock {
    const product = this.mockProducts.find((p) => p.id === stock.productId);
    const supplier = this.mockSuppliers.find((s) => s.id === stock.fournisseur_id);

    return {
      ...stock,
      productName: product ? product.name : `Product ${stock.productId}`,
      supplierName: supplier ? supplier.name : `Supplier ${stock.fournisseur_id}`,
    };
  }

  // Error handling
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error(error);
      return of(result as T);
    };
  }

  // Get products (mock implementation)
  getProducts(): Observable<any[]> {
    return of(this.mockProducts);
  }

  // Get suppliers (mock implementation)
  getSuppliers(): Observable<any[]> {
    return of(this.mockSuppliers);
  }
}