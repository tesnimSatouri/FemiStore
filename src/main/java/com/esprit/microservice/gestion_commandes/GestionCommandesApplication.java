package com.esprit.microservice.gestion_commandes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
@EnableFeignClients
@CrossOrigin(origins = "http://localhost:4200")

public class GestionCommandesApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionCommandesApplication.class, args);
	}

}
