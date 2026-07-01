package com.flexstays;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title       = "Flex-Stays HMS API",
        version     = "1.0",
        description = "Hotel Management System REST API — Flex-Stays",
        contact     = @Contact(name = "Flex-Stays Dev", email = "admin@flexstays.com")
    )
)
public class FlexStaysApplication {
    public static void main(String[] args) {
        SpringApplication.run(FlexStaysApplication.class, args);
    }
}
