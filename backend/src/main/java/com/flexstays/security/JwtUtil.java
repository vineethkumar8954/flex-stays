package com.flexstays.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility component for creating and validating JSON Web Tokens (JWT).
 *
 * <p>Uses JJWT 0.12.x (io.jsonwebtoken) with HS256 signing.
 * The secret and expiration are injected from application properties:
 * <pre>
 *   jwt.secret=your-256-bit-secret
 *   jwt.expiration.ms=86400000
 * </pre>
 */
@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    // -------------------------------------------------------------------------
    // Custom claim keys
    // -------------------------------------------------------------------------

    /** JWT claim key for the authenticated entity's role (e.g. "GUEST", "ADMIN"). */
    public static final String CLAIM_ROLE = "role";

    /**
     * JWT claim key to distinguish user types.
     * Value is either {@code "user"} (guest) or {@code "staff"} (hotel staff).
     */
    public static final String CLAIM_USER_TYPE = "userType";

    // -------------------------------------------------------------------------
    // Config
    // -------------------------------------------------------------------------

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.ms}")
    private long expirationMs;

    // -------------------------------------------------------------------------
    // Internal helper
    // -------------------------------------------------------------------------

    /**
     * Derives the {@link SecretKey} from the configured secret string.
     * The secret must be at least 256 bits (32 ASCII characters) for HS256.
     */
    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // -------------------------------------------------------------------------
    // Token generation
    // -------------------------------------------------------------------------

    /**
     * Generates a signed HS256 JWT.
     *
     * @param subject  the principal identifier (email address)
     * @param role     the role string stored in the {@code role} claim
     * @param userType {@code "user"} for guests, {@code "staff"} for hotel staff
     * @return compact, URL-safe JWT string
     */
    public String generateToken(String subject, String role, String userType) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(subject)
                .claim(CLAIM_ROLE, role)
                .claim(CLAIM_USER_TYPE, userType)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey(), Jwts.SIG.HS256)
                .compact();
    }

    // -------------------------------------------------------------------------
    // Token validation
    // -------------------------------------------------------------------------

    /**
     * Validates the given JWT token.
     *
     * @param token the compact JWT string to validate
     * @return {@code true} if the token is valid and not expired; {@code false} otherwise
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // -------------------------------------------------------------------------
    // Claim accessors
    // -------------------------------------------------------------------------

    /**
     * Extracts the subject (email) from the token.
     *
     * @param token the compact JWT string
     * @return the subject claim value
     */
    public String getSubject(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    /**
     * Extracts the {@code role} claim from the token.
     *
     * @param token the compact JWT string
     * @return role string (e.g. "GUEST", "ADMIN", "MANAGER")
     */
    public String getRole(String token) {
        return parseClaims(token).getPayload().get(CLAIM_ROLE, String.class);
    }

    /**
     * Extracts the {@code userType} claim from the token.
     *
     * @param token the compact JWT string
     * @return {@code "user"} or {@code "staff"}
     */
    public String getUserType(String token) {
        return parseClaims(token).getPayload().get(CLAIM_USER_TYPE, String.class);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Parses and verifies the JWT, returning the full {@link Jws<Claims>} result.
     * Throws a JJWT runtime exception if parsing fails.
     */
    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token);
    }
}
