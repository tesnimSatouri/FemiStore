package com.esprit.microservice.gestion_commandes.service;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private OrderRepository orderRepository;

    // ✅ Récupérer toutes les commandes
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Créer une commande
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // ✅ Supprimer une commande
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ✅ Mettre à jour une commande existante
    public Order updateOrder(Long id, Order updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setUserId(updatedOrder.getUserId());
            order.setTotalPrice(updatedOrder.getTotalPrice());
            order.setStatus(updatedOrder.getStatus());
            order.setDateCommande(updatedOrder.getDateCommande());
            return orderRepository.save(order);
        }).orElse(null);
    }
}
