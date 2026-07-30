package com.velvetbloom.ar.config;

import com.velvetbloom.ar.security.JwtAuthenticationFilter;
import com.velvetbloom.ar.security.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ADMIN = "ADMIN";
    private static final String SUPERADMIN = "SUPERADMIN";

    private final JwtAuthenticationFilter jwtFilter;
    private final RestAuthenticationEntryPoint authEntryPoint;
    private final AppProperties props;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter,
                          RestAuthenticationEntryPoint authEntryPoint,
                          AppProperties props) {
        this.jwtFilter = jwtFilter;
        this.authEntryPoint = authEntryPoint;
        this.props = props;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(authEntryPoint)
                    .accessDeniedHandler(authEntryPoint))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/health", "/error").permitAll()

                    // --- Auth ---
                    .requestMatchers(HttpMethod.POST,
                            "/api/auth/register", "/api/auth/login",
                            "/api/auth/admin/login", "/api/auth/refresh").permitAll()
                    .requestMatchers("/api/auth/logout", "/api/auth/me", "/api/auth/profile").authenticated()

                    // --- Restaurants ---
                    .requestMatchers(HttpMethod.GET, "/api/restaurants/*/qr-codes").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.GET, "/api/restaurants/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/restaurants").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.PUT, "/api/restaurants/*").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/restaurants/*/images").hasAnyRole(ADMIN, SUPERADMIN)

                    // --- Categories ---
                    .requestMatchers(HttpMethod.GET, "/api/categories/restaurant/**").permitAll()
                    .requestMatchers("/api/categories/**").hasAnyRole(ADMIN, SUPERADMIN)

                    // --- Menu (specific public routes before admin writes) ---
                    .requestMatchers(HttpMethod.POST, "/api/menu/*/ar-view").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/menu/*/model").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/menu/*/images").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/menu").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.PUT, "/api/menu/*").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.DELETE, "/api/menu/*").hasAnyRole(ADMIN, SUPERADMIN)

                    // --- Orders ---
                    .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/orders/validate-coupon").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/orders/track/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/orders/restaurant/**").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasAnyRole(ADMIN, SUPERADMIN)
                    .requestMatchers(HttpMethod.GET, "/api/orders/*").authenticated()

                    // --- Reviews ---
                    .requestMatchers(HttpMethod.GET, "/api/reviews/menu-item/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/reviews").permitAll()
                    .requestMatchers(HttpMethod.DELETE, "/api/reviews/*").hasAnyRole(ADMIN, SUPERADMIN)

                    // --- Analytics ---
                    .requestMatchers("/api/analytics/**").hasAnyRole(ADMIN, SUPERADMIN)

                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(props.getCors().getAllowedOrigins().split(","))
                .map(String::trim).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
