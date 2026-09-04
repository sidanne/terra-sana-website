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
        // "livre(?!ur)" et pas juste "livre" : "livre" est un sous-mot de "livreur"/"livreurs"
        // (transport), qui a sa propre categorie plus bas — sans ce garde-fou "Trajet commun
        // livreurs" tombait sur la photo bibliotheque au lieu de la photo livraison.
        KEYWORDS_TO_IMAGE.put("bibliotheque|bibliothèque|livre(?!ur)|catalogue",
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
        KEYWORDS_TO_IMAGE.put("voiture|automobile|covoiturage",
                "https://images.unsplash.com/photo-1565043666747-69f6646db940");
        KEYWORDS_TO_IMAGE.put("materiel|matériel|equipement|équipement|outil|location",
                "https://images.unsplash.com/photo-1685320198649-781e83a61de4");
        // "dons"/"donation" (pas "don" seul, sous-mot de "donc") pour eviter un faux positif sur
        // n'importe quelle description contenant ce connecteur tres courant.
        KEYWORDS_TO_IMAGE.put("dons|donation|collecte de fonds|financement|levee de fonds|levée de fonds",
                "https://images.unsplash.com/photo-1783227610898-d53b8125c4b0");
        KEYWORDS_TO_IMAGE.put("benevole|bénévole|benevolat|bénévolat",
                "https://images.unsplash.com/photo-1681949103006-70066fb25dfe");
        KEYWORDS_TO_IMAGE.put("communication|newsletter|reseaux sociaux|réseaux sociaux",
                "https://images.unsplash.com/photo-1611926653458-09294b3142bf");
        KEYWORDS_TO_IMAGE.put("stock|inventaire|entrepot|entrepôt",
                "https://images.unsplash.com/photo-1672552226380-486fe900b322");
        KEYWORDS_TO_IMAGE.put("sante|santé|medical|médical|pharmacie",
                "https://images.unsplash.com/photo-1580281657527-47f249e8f4df");
        KEYWORDS_TO_IMAGE.put("adhesion|adhésion|cotisation|membre",
                "https://images.unsplash.com/photo-1597463330912-eb868206b68e");
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
