package com.devdreamers.femistore;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StockService {

    private StockRepo stockRepository;
    private StockTrendApiClient stockTrendApiClient;

    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockByProductId(int productId) {
        return stockRepository.findByProductId(productId);
    }

    public Stock addStock(Stock stock) {
        Stock savedStock = stockRepository.save(stock);
        // Analyser les tendances après l'ajout
        analyzeStockTrend(savedStock);
        return savedStock;
    }

    public Stock updateStock(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        stock.setStockDisponible(quantity);
        Stock updatedStock = stockRepository.save(stock);
        // Analyser les tendances après la mise à jour
        analyzeStockTrend(updatedStock);
        return updatedStock;
    }

    public boolean isStockSufficient(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        boolean isSufficient = stock.getStockDisponible() >= quantity;
        if (!isSufficient) {
            // Analyser les tendances si le stock est insuffisant
            analyzeStockTrend(stock);
        }
        return isSufficient;
    }

    public void deleteStock(int id) {
        stockRepository.deleteById(id);
    }

    private void analyzeStockTrend(Stock stock) {
        stockTrendApiClient.analyzeStockTrend(stock.getProductId(), stock.getStockDisponible(), stock.getStock_minimum())
                .subscribe(trend -> {
                    String trendResult = (String) trend.get("trend");
                    int suggestedStock = (int) trend.get("suggestedStock");
                    System.out.println("Analyse pour le produit " + stock.getProductId() + ": Tendance = " + trendResult +
                            ", Suggestion de réapprovisionnement = " + suggestedStock);
                    if (stock.getStockDisponible() < stock.getStock_minimum()) {
                        System.out.println("Stock faible ! Suggestion: réapprovisionner à " + suggestedStock);
                    }
                });
    }
}