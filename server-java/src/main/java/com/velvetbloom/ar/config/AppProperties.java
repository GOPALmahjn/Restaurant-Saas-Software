package com.velvetbloom.ar.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Strongly-typed binding for the custom `app.*` configuration tree. */
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();
    private Cloudinary cloudinary = new Cloudinary();
    private Admin admin = new Admin();
    private String clientUrl = "http://localhost:5173";

    public Cors getCors() { return cors; }
    public void setCors(Cors cors) { this.cors = cors; }
    public Jwt getJwt() { return jwt; }
    public void setJwt(Jwt jwt) { this.jwt = jwt; }
    public Cloudinary getCloudinary() { return cloudinary; }
    public void setCloudinary(Cloudinary cloudinary) { this.cloudinary = cloudinary; }
    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
    public String getClientUrl() { return clientUrl; }
    public void setClientUrl(String clientUrl) { this.clientUrl = clientUrl; }

    public static class Cors {
        private String allowedOrigins = "http://localhost:5173";
        public String getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(String allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    }

    public static class Jwt {
        private String secret;
        private String refreshSecret;
        private long accessExpirationMs = 900_000L;
        private long refreshExpirationMs = 604_800_000L;
        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }
        public String getRefreshSecret() { return refreshSecret; }
        public void setRefreshSecret(String refreshSecret) { this.refreshSecret = refreshSecret; }
        public long getAccessExpirationMs() { return accessExpirationMs; }
        public void setAccessExpirationMs(long v) { this.accessExpirationMs = v; }
        public long getRefreshExpirationMs() { return refreshExpirationMs; }
        public void setRefreshExpirationMs(long v) { this.refreshExpirationMs = v; }
    }

    public static class Cloudinary {
        private String cloudName;
        private String apiKey;
        private String apiSecret;
        public String getCloudName() { return cloudName; }
        public void setCloudName(String cloudName) { this.cloudName = cloudName; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getApiSecret() { return apiSecret; }
        public void setApiSecret(String apiSecret) { this.apiSecret = apiSecret; }
    }

    public static class Admin {
        private String email = "admin@restaurant.com";
        private String password = "Admin@123456";
        private String name = "Super Admin";
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
