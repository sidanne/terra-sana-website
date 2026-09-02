package com.terresana.backend.model.enums;

/**
 * Statut d'un événement :
 * OPEN = ouvert aux inscriptions, FULL = complet (liste d'attente active),
 * CANCELLED = annulé, FINISHED = terminé (avis possibles).
 */
public enum EventStatus {
    OPEN,
    FULL,
    CANCELLED,
    FINISHED
}
