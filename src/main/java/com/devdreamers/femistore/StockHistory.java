package com.devdreamers.femistore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class StockHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int productId;
    private int quantityChange; // Quantité ajoutée (positive) ou retirée (négative)
    private LocalDateTime timestamp; // Date et heure de la modification
    private String reason; // Raison de la modification (ex: "vente", "réapprovisionnement")
}