package com.terresana.backend.controller;

import com.terresana.backend.config.JwtUtil;
import com.terresana.backend.model.Admin;
import com.terresana.backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminRepository adminRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AdminRepository adminRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.adminRepo = adminRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
        String token = jwtUtil.generateToken(username);
        return Map.of("token", token);
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        Admin admin = new Admin();
        admin.setUsername(body.get("username"));
        admin.setPassword(passwordEncoder.encode(body.get("password")));
        admin.setRole("ADMIN");
        adminRepo.save(admin);
        return Map.of("message", "Admin cree avec succes");
    }
}