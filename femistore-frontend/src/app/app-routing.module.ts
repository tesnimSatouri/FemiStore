import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"

const routes: Routes = [
  { path: "", redirectTo: "/inventory", pathMatch: "full" },
  {
    path: "inventory",
    loadChildren: () => import("./features/inventory/inventory.module").then((m) => m.InventoryModule),
  },
  { path: "**", redirectTo: "/inventory" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
