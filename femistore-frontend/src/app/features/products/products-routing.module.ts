import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent },
  { path: 'products', loadChildren: () => import('./products.module').then(m => m.ProductsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }