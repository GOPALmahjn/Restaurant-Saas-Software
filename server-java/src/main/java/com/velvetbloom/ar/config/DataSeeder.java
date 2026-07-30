package com.velvetbloom.ar.config;

import com.velvetbloom.ar.domain.user.User;
import com.velvetbloom.ar.domain.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Seeds the initial super-admin account on first startup. */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties props;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder, AppProperties props) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.props = props;
    }

    @Override
    public void run(String... args) {
        String email = props.getAdmin().getEmail();
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User admin = new User();
        admin.setName(props.getAdmin().getName());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(props.getAdmin().getPassword()));
        admin.setRole("superadmin");
        userRepository.save(admin);
        log.info("Seeded initial super-admin: {}", email);
    }
}
