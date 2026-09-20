package com.terresana.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final VolunteerJwtUtil volunteerJwtUtil;

    public JwtFilter(JwtUtil jwtUtil, VolunteerJwtUtil volunteerJwtUtil) {
        this.jwtUtil = jwtUtil;
        this.volunteerJwtUtil = volunteerJwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Admin et bénévole utilisent des clés secrètes distinctes (RG-25) : on essaie les deux
            if (jwtUtil.validateToken(token)) {
                authenticate(jwtUtil.extractUsername(token), "ROLE_ADMIN");
            } else if (volunteerJwtUtil.validateToken(token)) {
                authenticate(volunteerJwtUtil.extractUsername(token), "ROLE_VOLUNTEER");
            }
        }
        chain.doFilter(request, response);
    }

    // Place l'utilisateur authentifié (avec son rôle) dans le contexte de sécurité Spring
    private void authenticate(String username, String role) {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}