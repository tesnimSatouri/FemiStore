package com.esprit.twin.gestion_avis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class GestionAvisApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionAvisApplication.class, args);
    }

}
