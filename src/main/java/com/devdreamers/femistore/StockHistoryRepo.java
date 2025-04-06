package com.devdreamers.femistore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StockHistoryRepo extends JpaRepository<StockHistory, Long> {
    List<StockHistory> findByProductIdAndTimestampAfter(int productId, LocalDateTime timestamp);
}