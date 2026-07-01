package com.flexstays.config;

import com.flexstays.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Autowired
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Value("${cors.allowed.origins:http://localhost:3000}")
    private String allowedOrigins;


    // ── Public endpoints (no auth required) ──────────────────────────────────
    private static final String[] PUBLIC_GET = {
        "/rooms", "/rooms/**",
        "/packages", "/packages/**",
        "/swagger-ui/**", "/api-docs/**", "/swagger-ui.html"
    };

    private static final String[] PUBLIC_POST = {
        "/auth/signup",
        "/auth/login",
        "/auth/staff/login",
        "/auth/google",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/ai/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers(HttpMethod.GET,  PUBLIC_GET).permitAll()
                .requestMatchers(HttpMethod.POST, PUBLIC_POST).permitAll()

                // Guest only
                .requestMatchers("/bookings/**").hasAnyRole("GUEST", "ADMIN", "RECEPTION")
                .requestMatchers("/dining/**").hasAnyRole("GUEST", "ADMIN", "MANAGER")
                .requestMatchers("/events/**").hasAnyRole("GUEST", "ADMIN", "MANAGER")

                // Staff portals
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/reception/**").hasAnyRole("ADMIN", "RECEPTION")
                .requestMatchers("/housekeeping/**").hasAnyRole("ADMIN", "HOUSEKEEPING")
                .requestMatchers("/maintenance/**").hasAnyRole("ADMIN", "MAINTENANCE")
                .requestMatchers("/manager/**").hasAnyRole("ADMIN", "MANAGER")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
