package tn.femistore.femistoreproduct;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@Service
public class ExchangeRateService {
    private static final String API_KEY = "8891c37a9c2767f8e58690b9";
    private static final String API_URL = "https://v6.exchangerate-api.com/v6/" + API_KEY + "/latest/TND";
    private final RestTemplate restTemplate;
    public ExchangeRateService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Double getExchangeRate(String targetCurrency) {
        try {
            ExchangeRateResponse response = restTemplate.getForObject(API_URL, ExchangeRateResponse.class);
            if (response != null && "success".equals(response.getResult()) && response.getConversionRates() != null) {
                Double rate = response.getConversionRates().get(targetCurrency.toUpperCase());
                if (rate == null) {
                    throw new IllegalArgumentException("Currency " + targetCurrency + " not supported by ExchangeRate-API");
                }
                return rate;
            } else {
                throw new RuntimeException("Failed to fetch exchange rates: " + (response != null ? response.getResult() : "No response"));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching exchange rate for " + targetCurrency + ": " + e.getMessage(), e);
        }
    }
}
