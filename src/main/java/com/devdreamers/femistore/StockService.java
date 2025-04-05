package com.devdreamers.femistore;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StockService {

    private StockRepo stockRepository;

    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockByProductId(int productId) {
        return stockRepository.findByProductId(productId);
    }

    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }

    public Stock updateStock(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

       stock.setStockDisponible(quantity);
        return stockRepository.save(stock);
    }

    public boolean isStockSufficient(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        return stock.getStockDisponible() >= quantity;
    }

    public void deleteStock(int id) {
        stockRepository.deleteById(id);
    }
}
