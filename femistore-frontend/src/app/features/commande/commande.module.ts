import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { CommandeRoutingModule } from './commande-routing.module';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    OrderListComponent,
    OrderFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CommandeRoutingModule
  ]

})
export class commandesModule { }
