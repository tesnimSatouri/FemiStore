package tn.femistore.femistoreproduct;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Service for fetching external categories from an external API.
 * This service uses Java's HttpClient to make HTTP requests to an external API and retrieve a list of category names.
 */
@Service
public class ExternalCategoryService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalCategoryService.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${external.api.categories.url:https://api.example.com/categories}")
    private String externalApiUrl;

    public ExternalCategoryService() {
        // Initialize HttpClient with default settings
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(java.time.Duration.ofSeconds(5)) // Connection timeout
                .build();
        // Initialize ObjectMapper for JSON deserialization
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Fetches a list of category names from an external API.
     *
     * @return A list of category names, or an empty list if the request fails
     */
    public List<String> fetchExternalCategories() {
        try {
            logger.info("Fetching external categories from URL: {}", externalApiUrl);

            // Create an HTTP GET request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(externalApiUrl))
                    .timeout(java.time.Duration.ofSeconds(10)) // Read timeout
                    .GET()
                    .build();

            // Send the request and get the response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Check the response status
            if (response.statusCode() != 200) {
                logger.warn("External API returned status code {}: {}", response.statusCode(), response.body());
                return Collections.emptyList();
            }

            // Deserialize the response body (JSON array) into a String array
            String[] categories = objectMapper.readValue(response.body(), String[].class);

            if (categories != null) {
                logger.info("Successfully fetched {} external categories", categories.length);
                return Arrays.asList(categories);
            } else {
                logger.warn("No categories returned from external API");
                return Collections.emptyList();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch external categories from {}: {}", externalApiUrl, e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}