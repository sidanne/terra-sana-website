package com.terresana.backend.model.enums;

/**
 * Statut d'une inscription (conforme au diagramme de classes de l'analyse) :
 * WAITING = en attente de validation admin, qu'il s'agisse d'une simple attente de traitement
 * (position = null) ou d'une file d'attente car l'événement est complet (position renseignée, RG-09) ;
 * CONFIRMED = validée par l'admin (RG-10, RG-11) ; REFUSED = refusée par l'admin (RG-10, RG-11).
 * La désinscription volontaire du bénévole (RG-13) supprime la ligne plutôt que de la marquer.
 */
public enum RegistrationStatus {
    WAITING,
    CONFIRMED,
    REFUSED
}
