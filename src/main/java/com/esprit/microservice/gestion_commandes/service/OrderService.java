package com.esprit.microservice.gestion_commandes.service;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.entity.OrderItem;
import com.esprit.microservice.gestion_commandes.entity.OrderStatus;
import com.esprit.microservice.gestion_commandes.repository.OrderRepository;
import com.esprit.microservice.gestion_commandes.repository.OrderItemRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final EmailService emailService;

    // Injection de dépendance via constructeur
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.emailService = emailService;

    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

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
        Order savedOrder = orderRepository.save(order);

        // Envoi de l'email de confirmation
        emailService.sendOrderConfirmationEmail(order.getEmail(), savedOrder.getId(), savedOrder.getTotalPrice());

        return savedOrder;

    }

    // Mettre à jour une commande existante
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

    @Transactional
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public Map<String, Object> getOrderStats() {
        List<Order> orders = orderRepository.findAll();

        double totalRevenue = orders.stream().mapToDouble(Order::getTotalPrice).sum();
        double averageOrderValue = orders.isEmpty() ? 0 : totalRevenue / orders.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreCommandes", orders.size());
        stats.put("revenuTotal", totalRevenue);
        stats.put("valeurMoyenneCommande", averageOrderValue);

        return stats;
    }
    public Map<Long, Integer> getMostOrderedProducts() {
        List<Order> orders = orderRepository.findAll();

        Map<Long, Integer> productCount = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                productCount.put(item.getProductId(),
                        productCount.getOrDefault(item.getProductId(), 0) + item.getQuantite());
            }
        }

        // Trier et garder les 5 produits les plus commandés
        return productCount.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatut(newStatus);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID : " + orderId));
    }
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatut(status);
    }

    public List<Order> getAbandonedOrders(Duration delay) {
        LocalDateTime cutoff = LocalDateTime.now().minus(delay);
        return orderRepository.findByStatutAndCreatedAtBefore(OrderStatus.PENDING, cutoff);
    }

    @Scheduled(fixedRate = 3600000) // toutes les heures
    @Transactional
    public void expireAbandonedOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30); // délai de 30 minutes
        List<Order> abandonedOrders = orderRepository.findByStatutAndCreatedAtBefore(OrderStatus.PENDING, cutoff);

        for (Order order : abandonedOrders) {
            order.setStatut(OrderStatus.EXPIRED);
            orderRepository.save(order);
        }
    }
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

}
