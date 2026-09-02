package com.terresana.backend.model.enums;

/**
 * Niveau de fidélité du bénévole, calculé automatiquement
 * selon le nombre de participations confirmées (RG-18) :
 * BRONZE = 1-2 événements, ARGENT = 3-6, OR = 7 et plus.
 */
public enum Level {
    BRONZE,
    ARGENT,
    OR
}
