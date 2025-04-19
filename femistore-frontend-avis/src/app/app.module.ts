import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'; // Importez ceci
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Utile pour les 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvisListComponent } from './components/avis-list/avis-list.component';
import { AvisFormComponent } from './components/avis-form/avis-form.component';
import { ProductReviewsComponent } from './pages/product-reviews/product-reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    AvisListComponent,
    AvisFormComponent,
    ProductReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,        
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
