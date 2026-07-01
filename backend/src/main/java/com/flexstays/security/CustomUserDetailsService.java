package com.flexstays.security;

import com.flexstays.entity.Staff;
import com.flexstays.entity.User;
import com.flexstays.repository.StaffRepository;
import com.flexstays.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security {@link UserDetailsService} implementation that supports
 * two distinct principal types:
 *
 * <ul>
 *   <li><b>user</b>  – hotel guests stored in the {@code users} table</li>
 *   <li><b>staff</b> – hotel employees stored in the {@code staff} table</li>
 * </ul>
 *
 * <p>The correct repository is selected based on the {@code userType} claim
 * embedded in the JWT. Both {@link User} and {@link Staff} implement
 * {@link UserDetails}, so no adaptor wrapper is required.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    /** Constant matching the JWT {@code userType} claim value for guests. */
    public static final String TYPE_USER = "user";

    /** Constant matching the JWT {@code userType} claim value for staff. */
    public static final String TYPE_STAFF = "staff";

    private final UserRepository  userRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository, StaffRepository staffRepository) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
    }

    // -------------------------------------------------------------------------
    // UserDetailsService (standard contract – falls back to TYPE_USER)
    // -------------------------------------------------------------------------

    /**
     * Standard Spring Security entry-point; loads a guest {@link User} by email.
     * Use {@link #loadUserByUsernameAndType} when the caller knows the user type.
     *
     * @param username the email address of the guest
     * @return the guest's {@link UserDetails}
     * @throws UsernameNotFoundException if no guest exists with that email
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return loadUserByUsernameAndType(username, TYPE_USER);
    }

    // -------------------------------------------------------------------------
    // Primary entry-point (used by JwtAuthFilter)
    // -------------------------------------------------------------------------

    /**
     * Loads the correct {@link UserDetails} based on the JWT {@code userType} claim.
     *
     * @param username the email address of the principal
     * @param userType {@value #TYPE_USER} or {@value #TYPE_STAFF}
     * @return the principal's {@link UserDetails} (either {@link User} or {@link Staff})
     * @throws UsernameNotFoundException if no matching record is found
     * @throws IllegalArgumentException  if {@code userType} is not recognized
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsernameAndType(String username, String userType)
            throws UsernameNotFoundException {

        if (TYPE_STAFF.equalsIgnoreCase(userType)) {
            log.debug("Loading staff principal: {}", username);
            Staff staff = staffRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "Staff not found with email: " + username));
            return staff;

        } else if (TYPE_USER.equalsIgnoreCase(userType)) {
            log.debug("Loading guest principal: {}", username);
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "User not found with email: " + username));
            return user;

        } else {
            throw new IllegalArgumentException(
                    "Unknown userType in JWT claim: '" + userType + "'. " +
                    "Expected '" + TYPE_USER + "' or '" + TYPE_STAFF + "'.");
        }
    }
}
