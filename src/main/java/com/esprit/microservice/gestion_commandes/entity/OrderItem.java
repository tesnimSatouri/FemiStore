package com.esprit.microservice.gestion_commandes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private int quantite;
    private double prixUnitaire;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore // Empêche la récursion infinie lors du retour JSON
    private Order order;

    // Constructeurs
    public OrderItem() {
    }

    public OrderItem(Long productId, int quantite, double prixUnitaire, Order order) {
        this.productId = productId;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.order = order;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(double prixUnitaire) { this.prixUnitaire = prixUnitaire; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
