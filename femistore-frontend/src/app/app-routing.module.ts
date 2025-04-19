import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { AdminReviewSearchComponent } from "./features/avis/pages/admin-review-search/admin-review-search.component"
import { ProductReviewsComponent } from "./features/avis/pages/product-reviews/product-reviews.component"

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
  { path: 'commande', loadChildren: () => import('./features/commande/commande.module').then(m => m.commandesModule) },

  { path: 'products/:productId/reviews', component: ProductReviewsComponent },
  {path: 'admin/reviews', component: AdminReviewSearchComponent},
  
  { path: "**", redirectTo: "/inventory" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
