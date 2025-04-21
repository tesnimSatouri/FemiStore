import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component";
import { AbsPipe } from './shared/pipes/abs.pipe'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AvisListComponent } from "./features/avis/components/avis-list/avis-list.component";
import { AvisFormComponent } from "./features/avis/components/avis-form/avis-form.component";
import { ProductReviewsComponent } from "./features/avis/pages/product-reviews/product-reviews.component";
import { AdminReviewSearchComponent } from "./features/avis/pages/admin-review-search/admin-review-search.component";
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AppComponent, 
    AbsPipe, 
    NavbarComponent, 
    AvisListComponent,
    AvisFormComponent,
    ProductReviewsComponent,
    AdminReviewSearchComponent,
    HomeComponent],
  imports: [BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule, // Ajouté ici
    AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
