package com.esprit.microservice.gestion_commandes.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private double totalPrice;

    private LocalDate dateCommande;

    @Enumerated(EnumType.STRING)
    private OrderStatus statut;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    // 🔹 Constructeurs
    public Order() {
        this.dateCommande = LocalDate.now(); // Définit automatiquement la date actuelle
        this.statut = OrderStatus.PENDING; // Statut par défaut
    }

    public Order(Long userId, double totalPrice, List<OrderItem> orderItems) {
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.dateCommande = LocalDate.now();
        this.statut = OrderStatus.PENDING;
        this.orderItems = orderItems;
    }

    // 🔹 Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDate getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDate dateCommande) { this.dateCommande = dateCommande; }

    public OrderStatus getStatut() { return statut; }
    public void setStatut(OrderStatus statut) { this.statut = statut; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}
