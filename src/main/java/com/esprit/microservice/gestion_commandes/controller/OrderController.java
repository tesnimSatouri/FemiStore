package com.esprit.microservice.gestion_commandes.controller;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.entity.OrderStatus;
import com.esprit.microservice.gestion_commandes.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    // ✅ Injection de dépendances via constructeur
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Récupérer toutes les commandes
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // ✅ Créer une nouvelle commande
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ Mettre à jour une commande
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        try {
            Order order = orderService.updateOrder(id, updatedOrder);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Supprimer une commande
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        boolean deleted = orderService.deleteOrder(id);
        if (deleted) {
            return ResponseEntity.ok("Commande supprimée avec succès !");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Commande non trouvée avec l'ID : " + id);
        }
    }
    //stats
    @GetMapping("/stats")
    public Map<String, Object> getOrderStatistics() {
        return orderService.getOrderStats();
    }
    //  obtenir les produits les plus commandés
    @GetMapping("/top-products")
    public Map<Long, Integer> getTopProducts() {
        return orderService.getMostOrderedProducts();
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/status")
    public ResponseEntity<List<Order>> getOrdersByStatus(@RequestParam OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/abandoned")
    public ResponseEntity<List<Order>> getAbandonedOrders(@RequestParam(defaultValue = "30") long minutes) {
        List<Order> abandonedOrders = orderService.getAbandonedOrders(Duration.ofMinutes(minutes));
        return ResponseEntity.ok(abandonedOrders);
    }




}
