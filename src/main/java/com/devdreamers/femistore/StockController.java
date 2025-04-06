package com.devdreamers.femistore;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stock")
@AllArgsConstructor
public class StockController {

    private StockService stockService;
    private StockTrendApiClient stockTrendApiClient; // Injecter StockTrendApiClient pour l'analyse des tendances

    // Récupérer tous les stocks
    @GetMapping
    public List<Stock> getAllStock() {
        return stockService.getAllStock();
    }

    // Récupérer un stock par productId
    @GetMapping("/{productId}")
    public ResponseEntity<Stock> getStockByProductId(@PathVariable int productId) {
        Optional<Stock> stock = stockService.getStockByProductId(productId);
        return stock.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Vérifier si le stock est suffisant pour une quantité donnée
    @GetMapping("/{productId}/check")
    public ResponseEntity<Boolean> isStockSufficient(@PathVariable int productId, @RequestParam int quantity) {
        boolean isSufficient = stockService.isStockSufficient(productId, quantity);
        return ResponseEntity.ok(isSufficient);
    }

    // Ajouter un nouveau stock
    @PostMapping
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        Stock savedStock = stockService.addStock(stock);
        return ResponseEntity.status(201).body(savedStock); // Retourner un statut 201 Created
    }

    // Mettre à jour un stock existant
    @PutMapping("/{productId}")
    public ResponseEntity<Stock> updateStock(@PathVariable int productId, @RequestParam int quantity) {
        try {
            Stock updatedStock = stockService.updateStock(productId, quantity);
            return ResponseEntity.ok(updatedStock);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un stock par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStock(@PathVariable int id) {
        try {
            stockService.deleteStock(id);
            return ResponseEntity.ok("Stock supprimé avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Stock non trouvé !");
        }
    }

    // Nouvel endpoint pour exposer l'analyse des tendances
    @GetMapping("/{productId}/trend")
    public Mono<ResponseEntity<Map<String, ? extends Serializable>>> getStockTrend(@PathVariable int productId) {
        Optional<Stock> stockOptional = stockService.getStockByProductId(productId);
        if (stockOptional.isEmpty()) {
            return Mono.just(ResponseEntity.notFound().build());
        }

        Stock stock = stockOptional.get();
        return stockTrendApiClient.analyzeStockTrend(stock.getProductId(), stock.getStockDisponible(), stock.getStock_minimum())
                .map(trend -> {
                    Map<String, Serializable> enrichedTrend = new HashMap<>(trend);
                    enrichedTrend.put("stockDisponible", stock.getStockDisponible());
                    enrichedTrend.put("stockMinimum", stock.getStock_minimum());
                    return ResponseEntity.ok(enrichedTrend);
                });
    }
}