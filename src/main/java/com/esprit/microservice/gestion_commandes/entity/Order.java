package com.esprit.microservice.gestion_commandes.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private double totalPrice;

    private LocalDate dateCommande; // Pour affichage classique
    private LocalDateTime createdAt; // Pour gestion du temps réel

    private String email;

    @Enumerated(EnumType.STRING)
    private OrderStatus statut;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    // Initialisation automatique
    @PrePersist
    protected void onCreate() {
        this.dateCommande = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = OrderStatus.PENDING;
        }
    }

    //Constructeurs
    public Order() {}

    public Order(Long userId, double totalPrice, List<OrderItem> orderItems, String email) {
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.email = email; // Initialisation de l'email
        this.dateCommande = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.statut = OrderStatus.PENDING;
        this.orderItems = orderItems;
    }

    // 🔹 Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDate getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDate dateCommande) { this.dateCommande = dateCommande; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public OrderStatus getStatut() { return statut; }
    public void setStatut(OrderStatus statut) { this.statut = statut; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
