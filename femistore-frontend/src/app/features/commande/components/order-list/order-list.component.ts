import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from 'src/app/features/commande/services/order.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.loadOrders();
      }, error => {
        console.error('Erreur lors de la suppression :', error);
      });
    }
  }
  addOrder(): void {
    // Utilisez le chemin absolu correct incluant '/commande'
    this.router.navigate(['/commande/orders/add']); // <--- MODIFICATION ICI
  }
  
  editOrder(id: number): void {
    this.router.navigate(['/orders/edit', id]);
  }
}
