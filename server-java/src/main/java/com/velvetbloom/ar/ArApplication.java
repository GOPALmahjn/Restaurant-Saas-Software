package com.velvetbloom.ar;

import com.velvetbloom.ar.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ArApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArApplication.class, args);
    }
}
