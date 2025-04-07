package tn.femistore.femistoreproduct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ExternalCategoryService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalCategoryService.class);

    private final RestTemplate restTemplate;

    @Autowired
    public ExternalCategoryService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<String> fetchExternalCategories() {
        String url = "https://fakestoreapi.com/products/categories";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            logger.info("Response status: {}", response.getStatusCode());
            logger.debug("Response body: {}", response.getBody());

            List<String> categories = response.getBody();
            if (categories != null) {
                return categories.stream()
                        .filter(category -> category != null)
                        .limit(10)
                        .toList();
            }
            logger.warn("No categories found in response");
            return List.of();
        } catch (Exception e) {
            logger.error("Error fetching external categories: {}", e.getMessage(), e);
            return List.of();
        }
    }
}