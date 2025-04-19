import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { OrderService } from 'src/app/features/commande/services/order.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  order: Order = {
    userId: 0,
    email: '',
    orderItems: []
  };

  isEditMode: boolean = false;

  constructor(private orderService: OrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.orderService.getOrderById(id).subscribe(data => {
        this.order = data;
      });
    }
  }

  addOrderItem(): void {
    const newItem: OrderItem = {
      productId: 0,
      quantite: 1,
      prixUnitaire: 0
    };
    this.order.orderItems.push(newItem);
  }

  removeOrderItem(index: number): void {
    this.order.orderItems.splice(index, 1);
  }

  saveOrder(): void {
    if (this.isEditMode && this.order.id) {
      this.orderService.updateOrder(this.order.id, this.order).subscribe(() => {
        alert('Commande modifiée avec succès');
        this.router.navigate(['/orders']);
      });
    } else {
      this.orderService.createOrder(this.order).subscribe(() => {
        alert('Commande ajoutée avec succès');
        this.router.navigate(['/orders']);
      });
    }
  }
}
