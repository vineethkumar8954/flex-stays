package com.flexstays.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Spring Security filter that intercepts every HTTP request exactly once,
 * extracts the JWT Bearer token from the {@code Authorization} header,
 * validates it, and sets the authenticated principal in the
 * {@link SecurityContextHolder}.
 *
 * <p>Filter order is handled by Spring Boot's auto-configuration;
 * add it before {@code UsernamePasswordAuthenticationFilter} in your
 * {@code SecurityConfig}.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTH_HEADER = "Authorization";

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // -------------------------------------------------------------------------
    // Filter logic
    // -------------------------------------------------------------------------

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String token = extractToken(request);

            if (token != null && jwtUtil.validateToken(token)) {
                String subject  = jwtUtil.getSubject(token);
                String userType = jwtUtil.getUserType(token);

                // Load the correct UserDetails based on the userType claim
                UserDetails userDetails = userDetailsService.loadUserByUsernameAndType(subject, userType);

                // Build an authenticated token and attach request details
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Publish to the security context for this request thread
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Authenticated {} '{}' via JWT", userType, subject);
            }

        } catch (Exception ex) {
            // Log but do not halt the filter chain – Spring Security will return 401
            log.error("Could not set user authentication from JWT: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------

    /**
     * Extracts the raw JWT string from the {@code Authorization: Bearer <token>} header.
     *
     * @param request the incoming HTTP request
     * @return the JWT string, or {@code null} if no valid Bearer header is present
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasText(header) && header.startsWith(BEARER_PREFIX)) {
            return header.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
