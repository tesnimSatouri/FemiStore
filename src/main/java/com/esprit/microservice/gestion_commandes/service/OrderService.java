package com.esprit.microservice.gestion_commandes.service;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.entity.OrderItem;
import com.esprit.microservice.gestion_commandes.entity.OrderStatus;
import com.esprit.microservice.gestion_commandes.repository.OrderRepository;
import com.esprit.microservice.gestion_commandes.repository.OrderItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // ✅ Injection de dépendance via constructeur
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // ✅ Récupérer toutes les commandes
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Créer une commande avec ses OrderItems
    @Transactional
    public Order createOrder(Order order) {
        if (order == null || order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Une commande doit contenir au moins un article.");
        }

        // Associer chaque OrderItem à l'Order et calculer le prix total
        double totalPrice = 0;
        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);
            totalPrice += item.getPrixUnitaire() * item.getQuantite();
        }
        order.setTotalPrice(totalPrice);
        order.setStatut(OrderStatus.PENDING); // Statut par défaut

        // Sauvegarde en cascade grâce à `CascadeType.ALL` sur OrderItems
        return orderRepository.save(order);
    }

    // ✅ Mettre à jour une commande existante
    @Transactional
    public Order updateOrder(Long id, Order updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setUserId(updatedOrder.getUserId());
            order.setStatut(updatedOrder.getStatut());

            // Mise à jour des articles associés
            if (updatedOrder.getOrderItems() != null) {
                order.getOrderItems().clear();
                for (OrderItem item : updatedOrder.getOrderItems()) {
                    item.setOrder(order);
                    order.getOrderItems().add(item);
                }
            }

            // Recalcul du prix total
            double totalPrice = order.getOrderItems().stream()
                    .mapToDouble(item -> item.getPrixUnitaire() * item.getQuantite())
                    .sum();
            order.setTotalPrice(totalPrice);

            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID : " + id));
    }

    // ✅ Supprimer une commande avec gestion des OrderItems
    @Transactional
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
