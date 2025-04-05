package com.esprit.microservice.gestion_commandes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class GestionCommandesApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionCommandesApplication.class, args);
	}

}
