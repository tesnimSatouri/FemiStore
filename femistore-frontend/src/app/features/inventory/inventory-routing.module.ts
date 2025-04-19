import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StockListComponent } from "./components/stock-list/stock-list.component";
import { StockFormComponent } from "./components/stock-form/stock-form.component";
import { StockDetailComponent } from "./components/stock-detail/stock-detail.component";
import { StockHistoryComponent } from "./components/stock-history/stock-history.component";
import { StockTrendComponent } from "./components/stock-trend/stock-trend.component";

const routes: Routes = [
  { path: "", component: StockListComponent },
  { path: "add", component: StockFormComponent },
  { path: "edit/:id", component: StockFormComponent },
  { path: "detail/:id", component: StockDetailComponent },
  { path: "history/:id", component: StockHistoryComponent },
  { path: "trend/:id", component: StockTrendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}