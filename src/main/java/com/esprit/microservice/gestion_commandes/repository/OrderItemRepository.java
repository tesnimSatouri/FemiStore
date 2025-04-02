package com.esprit.microservice.gestion_commandes.repository;

import com.esprit.microservice.gestion_commandes.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
