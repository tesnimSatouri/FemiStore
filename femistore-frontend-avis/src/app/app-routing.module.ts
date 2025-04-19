import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductReviewsComponent } from './pages/product-reviews/product-reviews.component';
import { AvisListComponent } from './components/avis-list/avis-list.component';
import { AvisFormComponent } from './components/avis-form/avis-form.component';


const routes: Routes = [

  { path: 'products/:productId/reviews', component: ProductReviewsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
