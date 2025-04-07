package com.esprit.microservice.gestion_commandes.repository;

import com.esprit.microservice.gestion_commandes.entity.Order;
import com.esprit.microservice.gestion_commandes.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatut(OrderStatus status);
    List<Order> findByStatutAndCreatedAtBefore(OrderStatus statut, LocalDateTime cutoffTime);
    List<Order> findByUserId(Long userId); // ✅ Recherche par userId


}
