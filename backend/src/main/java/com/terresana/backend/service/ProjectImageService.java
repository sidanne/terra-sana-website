package com.terresana.backend.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Choisit automatiquement une photo pour un projet du hub quand l'admin n'en fournit pas
 * (même logique que EventImageService pour les événements) : mots-clés dans le nom + la
 * description, associés à une vraie photo Unsplash déjà vérifiée. Les mots-clés les plus
 * précis sont testés avant les plus génériques pour éviter qu'un terme large (ex. "vente")
 * ne capture un sujet qui a une image plus adaptée (ex. "brocante" spécifiquement).
 */
@Service
public class ProjectImageService {

    private static final Map<String, String> KEYWORDS_TO_IMAGE = new LinkedHashMap<>();
    static {
        KEYWORDS_TO_IMAGE.put("facture|invoice",
                "https://images.unsplash.com/photo-1746221331496-a87689fc8eb9");
        KEYWORDS_TO_IMAGE.put("comptab",
                "https://images.unsplash.com/photo-1772588627527-db42040f3a8b");
        KEYWORDS_TO_IMAGE.put("agenda|planning|planificat|calendrier|tache|tâche",
                "https://images.unsplash.com/photo-1435527173128-983b87201f4d");
        KEYWORDS_TO_IMAGE.put("ecommerce|e-commerce|boutique en ligne|vente en ligne",
                "https://images.unsplash.com/photo-1514792368985-f80e9d482a02");
        KEYWORDS_TO_IMAGE.put("bibliotheque|bibliothèque|livre|catalogue",
                "https://images.unsplash.com/photo-1642980553701-c6b8bb0956ee");
        KEYWORDS_TO_IMAGE.put("recette|cuisine|culinaire",
                "https://images.unsplash.com/photo-1769987935906-0dce6d6a635a");
        KEYWORDS_TO_IMAGE.put("vehicule|véhicule|camion|camionnette|utilitaire",
                "https://images.unsplash.com/photo-1768638687895-b5ee4a586c7f");
        KEYWORDS_TO_IMAGE.put("cout|coût|budget|depense|dépense",
                "https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d");
        KEYWORDS_TO_IMAGE.put("collection|verre|biere|bière",
                "https://images.unsplash.com/photo-1694903006266-cd0d42d8ae0b");
        KEYWORDS_TO_IMAGE.put("trajet|livreur|livraison",
                "https://images.unsplash.com/photo-1699817359842-904bdd28c6f6");
        KEYWORDS_TO_IMAGE.put("materiel|matériel|equipement|équipement|outil|location",
                "https://images.unsplash.com/photo-1685320198649-781e83a61de4");
        KEYWORDS_TO_IMAGE.put("brocante|seconde main|occasion|marche|marché",
                "https://images.unsplash.com/photo-1760625345932-448b852afdf9");
    }

    // Photo neutre (bureau, écran, gestion) utilisée si aucun mot-clé ne correspond
    private static final String DEFAULT_IMAGE = "https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d";
    private static final String IMAGE_PARAMS = "?w=1200&q=80&auto=format&fit=crop";

    public String pickImageFor(String name, String description) {
        String text = normalize((name == null ? "" : name) + " " + (description == null ? "" : description));
        for (Map.Entry<String, String> entry : KEYWORDS_TO_IMAGE.entrySet()) {
            if (Pattern.compile(entry.getKey()).matcher(text).find()) {
                return entry.getValue() + IMAGE_PARAMS;
            }
        }
        return DEFAULT_IMAGE + IMAGE_PARAMS;
    }

    private String normalize(String s) {
        return Normalizer.normalize(s.toLowerCase(), Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }
}
