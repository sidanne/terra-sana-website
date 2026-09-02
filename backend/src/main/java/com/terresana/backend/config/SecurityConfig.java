package com.terresana.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * RG-23 — Les endpoints d'administration sont réservés au rôle ADMIN.
 * Le reste (public + bénévole authentifié) reste ouvert : chaque contrôleur
 * gère lui-même l'identification du bénévole via son token JWT (RG-24).
 */
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .authorizeHttpRequests(auth -> auth
                // Les requêtes de pré-vérification CORS ne portent jamais de token : toujours les laisser passer
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ── Public : authentification et inscription ──
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/forgotPassword").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/resetPassword").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/volunteers/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/volunteers/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/volunteers/forgot-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/volunteers/reset-password").permitAll()

                // ── Public : lecture du site vitrine ──
                .requestMatchers(HttpMethod.GET, "/api/events", "/api/events/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/projects", "/api/projects/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/event/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                // "me" n'est pas un identifiant numérique : à placer AVANT la règle admin
                // /api/volunteers/* ci-dessous, sinon "me" s'y ferait piéger (même longueur de chemin)
                .requestMatchers(HttpMethod.GET, "/api/volunteers/me").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/volunteers/me").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/volunteers/me/attestation/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/volunteers/me/participation-history").permitAll()
                // Compteur public pour les statistiques de la page d'accueil (aucune donnée personnelle)
                .requestMatchers(HttpMethod.GET, "/api/volunteers/count").permitAll()

                // ── Réservé à l'administrateur (RG-23) ──
                .requestMatchers(HttpMethod.POST, "/api/auth/register").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/auth/changePassword").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/auth/updateProfile").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/volunteers", "/api/volunteers/paged", "/api/volunteers/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/volunteers/*/toggle-active").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/events/paged").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/events").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/registrations", "/api/registrations/event/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/registrations/event/*/group-email").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/registrations/*/confirm").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/registrations/*/reject").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reviews").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/contact").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/contact/*/reply").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/posts").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/projects").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/projects/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**").hasRole("ADMIN")

                // ── Reste : accessible à tout token valide (bénévole ou admin) ──
                // chaque contrôleur vérifie déjà l'identité exacte via le token (ex: on ne peut annuler que sa propre inscription)
                .requestMatchers("/**").permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuration CORS globale, prise en compte par Spring Security lui-même (pas seulement @CrossOrigin).
    // Nécessaire depuis qu'on filtre par rôle : sans ça, les réponses 401/403 générées par Security
    // n'obtiennent jamais les en-têtes CORS, ce que le navigateur interprète (à tort) comme une erreur CORS.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
