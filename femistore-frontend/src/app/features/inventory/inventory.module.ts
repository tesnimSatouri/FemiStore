import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { InventoryRoutingModule } from "./inventory-routing.module"
import { StockListComponent } from "./components/stock-list/stock-list.component"
import { StockFormComponent } from "./components/stock-form/stock-form.component"
import { StockDetailComponent } from "./components/stock-detail/stock-detail.component"
import { LowStockAlertComponent } from "./components/low-stock-alert/low-stock-alert.component"
import { StockHistoryComponent } from "./components/stock-history/stock-history.component"
import { StockTrendComponent } from "./components/stock-trend/stock-trend.component"

@NgModule({
  declarations: [
    StockListComponent,
    StockFormComponent,
    StockDetailComponent,
    LowStockAlertComponent,
    StockHistoryComponent,
    StockTrendComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, InventoryRoutingModule],
})
export class InventoryModule {}
