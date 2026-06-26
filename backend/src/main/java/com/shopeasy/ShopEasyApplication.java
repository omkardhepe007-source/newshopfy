package com.shopeasy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ShopEasyApplication - Main entry point for the Spring Boot application.
 * @SpringBootApplication enables auto-configuration, component scanning,
 * and configuration support.
 */
@SpringBootApplication
public class ShopEasyApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopEasyApplication.class, args);
        System.out.println("✅ ShopEasy Backend Started at http://localhost:8080");
        System.out.println("📘 Swagger UI: http://localhost:8080/swagger-ui.html");
    }
}
