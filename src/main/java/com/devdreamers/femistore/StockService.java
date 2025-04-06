package com.devdreamers.femistore;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StockService {

    private StockRepo stockRepository;
    private StockHistoryRepo stockHistoryRepo; // Ajouter le repository pour StockHistory
    private StockTrendApiClient stockTrendApiClient;
    private NotificationService notificationService;

    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockByProductId(int productId) {
        return stockRepository.findByProductId(productId);
    }

    public Stock addStock(Stock stock) {
        Stock savedStock = stockRepository.save(stock);
        // Enregistrer l'ajout dans l'historique
        recordStockChange(stock.getProductId(), stock.getStockDisponible(), "Ajout initial");
        analyzeStockTrend(savedStock);
        return savedStock;
    }

    public Stock updateStock(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        int quantityChange = quantity - stock.getStockDisponible();
        stock.setStockDisponible(quantity);
        Stock updatedStock = stockRepository.save(stock);
        // Enregistrer la mise à jour dans l'historique
        recordStockChange(productId, quantityChange, "Mise à jour manuelle");
        analyzeStockTrend(updatedStock);
        return updatedStock;
    }

    public boolean isStockSufficient(int productId, int quantity) {
        Stock stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        boolean isSufficient = stock.getStockDisponible() >= quantity;
        if (!isSufficient) {
            analyzeStockTrend(stock);
        } else if (quantity > 0) {
            // Enregistrer une sortie de stock (vente)
            stock.setStockDisponible(stock.getStockDisponible() - quantity);
            stockRepository.save(stock);
            recordStockChange(productId, -quantity, "Vente");
        }
        return isSufficient;
    }

    public void deleteStock(int id) {
        stockRepository.deleteById(id);
    }

    private void recordStockChange(int productId, int quantityChange, String reason) {
        StockHistory history = new StockHistory();
        history.setProductId(productId);
        history.setQuantityChange(quantityChange);
        history.setTimestamp(LocalDateTime.now());
        history.setReason(reason);
        stockHistoryRepo.save(history);
    }

    public void analyzeStockTrend(Stock stock) {
        stockTrendApiClient.analyzeStockTrend(stock.getProductId(), stock.getStockDisponible(), stock.getStock_minimum())
                .subscribe(
                        trend -> {
                            String trendResult = (String) trend.get("trend");
                            int suggestedStock = (int) trend.get("suggestedStock");
                            System.out.println("Analyse pour le produit " + stock.getProductId() + ": Tendance = " + trendResult +
                                    ", Suggestion de réapprovisionnement = " + suggestedStock);

                            // Prédire la demande future
                            double predictedDemand = predictDemand(stock.getProductId());
                            System.out.println("Demande prévue pour les 7 prochains jours : " + predictedDemand);
                            System.out.println("Stock actuel : " + stock.getStockDisponible() + ", Stock minimum : " + stock.getStock_minimum());

                            // Vérifier si le stock est insuffisant par rapport à la demande prévue
                            if (stock.getStockDisponible() < predictedDemand || stock.getStockDisponible() < stock.getStock_minimum()) {
                                System.out.println("Stock faible ! Suggestion: réapprovisionner à " + suggestedStock);
                                // Envoyer une notification
                                notificationService.sendReplenishmentNotification(
                                        stock.getProductId(),
                                        predictedDemand,
                                        stock.getStockDisponible(),
                                        suggestedStock
                                );
                                System.out.println("Notification envoyée pour le produit " + stock.getProductId());
                            } else {
                                System.out.println("Stock suffisant, pas de notification nécessaire.");
                            }
                        },
                        throwable -> {
                            System.err.println("Erreur lors de l'analyse des tendances pour le produit " + stock.getProductId() + ": " + throwable.getMessage());
                            throwable.printStackTrace();
                        },
                        () -> System.out.println("Analyse des tendances terminée pour le produit " + stock.getProductId())
                );
    }


    public double predictDemand(int productId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<StockHistory> history = stockHistoryRepo.findByProductIdAndTimestampAfter(productId, sevenDaysAgo);

        double totalDemand = history.stream()
                .filter(h -> h.getQuantityChange() < 0)
                .mapToInt(h -> Math.abs(h.getQuantityChange()))
                .sum();

        long daysWithDemand = history.stream()
                .filter(h -> h.getQuantityChange() < 0)
                .map(StockHistory::getTimestamp)
                .map(LocalDateTime::toLocalDate)
                .distinct()
                .count();

        if (daysWithDemand == 0) {
            return 0;
        }

        double averageDailyDemand = totalDemand / daysWithDemand;
        return averageDailyDemand * 7;
    }
}