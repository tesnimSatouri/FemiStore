package com.esprit.microservice.gestion_commandes.repository;

import com.esprit.microservice.gestion_commandes.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
