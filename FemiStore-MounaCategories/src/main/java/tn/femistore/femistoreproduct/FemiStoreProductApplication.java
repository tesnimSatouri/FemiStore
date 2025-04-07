package tn.femistore.femistoreproduct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main application class for the FemiStoreProduct service.
 * This service is part of the FemiStore Fashion App and handles category management.
 * It registers with a Eureka server for service discovery and provides REST APIs for managing categories.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class FemiStoreProductApplication {

	private static final Logger logger = LoggerFactory.getLogger(FemiStoreProductApplication.class);

	public static void main(String[] args) {
		logger.info("Starting FemiStoreProductApplication...");
		SpringApplication.run(FemiStoreProductApplication.class, args);
		logger.info("FemiStoreProductApplication started successfully.");
	}

	/**
	 * Configures CORS to allow requests from the frontend (http://localhost:4200).
	 *
	 * @return A WebMvcConfigurer for CORS configuration
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:4200")
						.allowedMethods("GET", "POST", "PUT", "DELETE")
						.allowedHeaders("*");
			}
		};
	}

	/**
	 * CommandLineRunner bean to log application status after startup.
	 *
	 * @return A CommandLineRunner that logs the application status
	 */
	@Bean
	public CommandLineRunner commandLineRunner() {
		return args -> {
			logger.info("FemiStoreProductApplication is running and registered with Eureka.");
			logger.info("Access the application at: http://localhost:8488");
			logger.info("Eureka Dashboard: http://localhost:8761");
		};
	}
}