package com.terresana.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

/**
 * Génère et valide les tokens JWT des bénévoles, avec une clé secrète
 * indépendante de celle de l'administrateur (RG-25).
 */
@Component
public class VolunteerJwtUtil {

    // Clé fixe chargée depuis application.properties, comme JwtUtil (admin) : sinon tous les tokens
    // bénévoles deviennent invalides à chaque redémarrage du backend (clé générée aléatoirement à chaque fois)
    private final Key key;

    public VolunteerJwtUtil(@Value("${jwt.volunteer.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secret));
    }

    // Durée volontairement distincte de celle de l'admin (RG-23, RG-25) — 7 jours au lieu de 24h,
    // car un bénévole revient consulter ses inscriptions sur plusieurs jours contrairement à l'admin
    private final long EXPIRATION = 604800000;

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
