package com.terresana.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Centralise la gestion des erreurs métier : sans ceci, chaque "throw new RuntimeException(message)"
 * du code (email déjà utilisé, mot de passe incorrect, inscription déjà existante, etc.) finit en
 * erreur 500 générique de Spring, et le message clair écrit dans le service n'atteint jamais le frontend.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }
}
