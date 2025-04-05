package com.devdreamers.femistore;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stock")
@AllArgsConstructor
public class StockController {


    private StockService stockService;

    @GetMapping
    public List<Stock> getAllStock() {
        return stockService.getAllStock();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Stock> getStockByProductId(@PathVariable int productId) {
        Optional<Stock> stock = stockService.getStockByProductId(productId);
        return stock.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{productId}/check")
    public ResponseEntity<Boolean> isStockSufficient(@PathVariable int productId, @RequestParam int quantity) {
        boolean isSufficient = stockService.isStockSufficient(productId, quantity);
        return ResponseEntity.ok(isSufficient);
    }


    @PostMapping
    public Stock addStock(@RequestBody Stock stock) {
        return stockService.addStock(stock);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Stock> updateStock(@PathVariable int productId, @RequestParam int quantity) {
        Stock updatedStock = stockService.updateStock(productId, quantity);
        return ResponseEntity.ok(updatedStock);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStock(@PathVariable int id) {
        stockService.deleteStock(id);
        return ResponseEntity.ok("Stock supprimé avec succès !");
    }
}
