package com.esprit.twin.gestion_avis.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Avis")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")

    private Long id;
    @Column(name = "userid")

    private Long userId;
    @Column(name = "productid")

    private Long productId;
    @Column(name = "note")

    private int note;
    @Column(name = "commentaire")

    private String commentaire;
    @Column(name = "date")

    private LocalDate date;
}
