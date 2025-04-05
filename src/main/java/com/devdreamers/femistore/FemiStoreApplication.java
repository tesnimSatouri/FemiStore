package com.devdreamers.femistore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class FemiStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(FemiStoreApplication.class, args);
	}

}
