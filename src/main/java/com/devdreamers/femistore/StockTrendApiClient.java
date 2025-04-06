package com.devdreamers.femistore;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Service
public class StockTrendApiClient {

    private final WebClient webClient;
    private final String apiKey;

    public StockTrendApiClient(WebClient.Builder webClientBuilder, @Value("${alpha-vantage.api-key}") String apiKey) {
        this.webClient = webClientBuilder.baseUrl("https://www.alphavantage.co").build();
        this.apiKey = apiKey;
    }

    public Mono<Map<String, ? extends Serializable>> analyzeStockTrend(int productId, int stockDisponible, int stockMinimum) {
        String symbol = "IBM"; // Essaye aussi "AAPL" ou "MSFT" si "IBM" ne fonctionne pas

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", "TIME_SERIES_DAILY")
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class) // La réponse brute de l'API
                .map(response -> {
                    // Vérifier si la réponse contient une erreur
                    if (response.containsKey("Error Message")) {
                        System.out.println("Erreur Alpha Vantage: " + response.get("Error Message"));
                        return Map.of(
                                "productId", productId,
                                "trend", "erreur",
                                "suggestedStock", 0
                        );
                    }

                    // Vérifier si la réponse contient une note (par exemple, limite de requêtes dépassée)
                    if (response.containsKey("Note")) {
                        System.out.println("Note Alpha Vantage: " + response.get("Note"));
                        return Map.of(
                                "productId", productId,
                                "trend", "limite_atteinte",
                                "suggestedStock", 0
                        );
                    }

                    // Extraire les données de la série temporelle
                    Map<String, Map<String, String>> timeSeries = (Map<String, Map<String, String>>) response.get("Time Series (Daily)");
                    if (timeSeries == null) {
                        System.out.println("Aucune donnée de série temporelle trouvée dans la réponse: " + response);
                        return Map.of(
                                "productId", productId,
                                "trend", "inconnu",
                                "suggestedStock", 0
                        );
                    }

                    // Prendre les deux derniers jours pour analyser la tendance
                    String[] dates = timeSeries.keySet().stream().sorted().toArray(String[]::new);
                    if (dates.length < 2) {
                        System.out.println("Pas assez de données pour analyser la tendance: " + timeSeries);
                        return Map.of(
                                "productId", productId,
                                "trend", "inconnu",
                                "suggestedStock", 0
                        );
                    }

                    double price1 = Double.parseDouble(timeSeries.get(dates[dates.length - 1]).get("4. close"));
                    double price2 = Double.parseDouble(timeSeries.get(dates[dates.length - 2]).get("4. close"));

                    // Déterminer la tendance
                    String trend = price1 > price2 ? "croissant" : (price1 < price2 ? "décroissant" : "stable");

                    // Suggestion de réapprovisionnement basée sur le stock minimum et la tendance
                    int suggestedStock = stockMinimum * 2; // Exemple simple
                    if (trend.equals("décroissant")) {
                        suggestedStock += stockMinimum; // Augmenter si la demande semble croître
                    }

                    // Créer une Map explicite pour éviter les problèmes de typage
                    Map<String, Serializable> result = new HashMap<>();
                    result.put("productId", productId);
                    result.put("trend", trend);
                    result.put("suggestedStock", suggestedStock);

                    return result;
                })
                .onErrorResume(e -> {
                    System.out.println("Erreur lors de l'appel à Alpha Vantage: " + e.getMessage());
                    return Mono.just(Map.of(
                            "productId", productId,
                            "trend", "erreur",
                            "suggestedStock", 0
                    ));
                });
    }
}