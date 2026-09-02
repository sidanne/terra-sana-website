package com.terresana.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Clé fixe chargée depuis application.properties : les tokens restent valides même après un redémarrage
    private final Key key;
    private final long EXPIRATION = 86400000;

    public JwtUtil(@Value("${jwt.admin.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secret));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
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

    // Admin.forgotPassword()/resetPassword() (diagramme de classes) — jeton dédié, courte durée de vie,
    // marqué "purpose=reset" pour qu'il ne puisse pas servir de token de connexion classique.
    // Pas de colonne resetToken en base (absente du dictionnaire de données pour "admin") : le jeton
    // JWT signé est auto-suffisant, sa signature et son expiration (30 min) suffisent à le valider.
    public String generatePasswordResetToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("purpose", "reset")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1800000))
                .signWith(key)
                .compact();
    }

    public String extractUsernameFromResetToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        if (!"reset".equals(claims.get("purpose"))) {
            throw new JwtException("Jeton invalide pour cette opération.");
        }
        return claims.getSubject();
    }
}
