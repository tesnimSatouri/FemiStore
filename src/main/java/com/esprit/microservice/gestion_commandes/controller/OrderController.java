package com.esprit.microservice.gestion_commandes.controller;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
