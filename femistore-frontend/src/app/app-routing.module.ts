import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"

const routes: Routes = [
  { path: "", redirectTo: "/inventory", pathMatch: "full" },
  {
    path: "inventory",
    loadChildren: () => import("./features/inventory/inventory.module").then((m) => m.InventoryModule),
  },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  {path:'categoris', loadChildren: () => import('./features/category/category.module').then(m => m.CategorisModule)},
  {path:'users', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)},
  { path: "**", redirectTo: "/inventory" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
