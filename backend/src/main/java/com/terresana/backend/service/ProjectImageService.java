package com.terresana.backend.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.List;
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

    // Chaque catégorie a une ou plusieurs photos : quand plusieurs projets tombent dans la même
    // catégorie, ils n'affichent pas forcément tous la même image (voir pickVariant).
    private static final Map<String, List<String>> KEYWORDS_TO_IMAGES = new LinkedHashMap<>();
    static {
        KEYWORDS_TO_IMAGES.put("facture|invoice", List.of(
                "https://images.unsplash.com/photo-1746221331496-a87689fc8eb9"));
        KEYWORDS_TO_IMAGES.put("comptab", List.of(
                "https://images.unsplash.com/photo-1772588627527-db42040f3a8b"));
        KEYWORDS_TO_IMAGES.put("agenda|planning|planificat|calendrier|tache|tâche", List.of(
                "https://images.unsplash.com/photo-1435527173128-983b87201f4d"));
        KEYWORDS_TO_IMAGES.put("ecommerce|e-commerce|boutique en ligne|vente en ligne", List.of(
                "https://images.unsplash.com/photo-1514792368985-f80e9d482a02"));
        // "livre(?!ur)" et pas juste "livre" : "livre" est un sous-mot de "livreur"/"livreurs"
        // (transport), qui a sa propre categorie plus bas — sans ce garde-fou "Trajet commun
        // livreurs" tombait sur la photo bibliotheque au lieu de la photo livraison.
        KEYWORDS_TO_IMAGES.put("bibliotheque|bibliothèque|livre(?!ur)|catalogue", List.of(
                "https://images.unsplash.com/photo-1642980553701-c6b8bb0956ee"));
        KEYWORDS_TO_IMAGES.put("recette|cuisine|culinaire", List.of(
                "https://images.unsplash.com/photo-1769987935906-0dce6d6a635a"));
        KEYWORDS_TO_IMAGES.put("vehicule|véhicule|camion|camionnette|utilitaire", List.of(
                "https://images.unsplash.com/photo-1768638687895-b5ee4a586c7f"));
        KEYWORDS_TO_IMAGES.put("cout|coût|budget|depense|dépense", List.of(
                "https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d",
                "https://images.unsplash.com/photo-1762831063004-bbd3ea38ba3a"));
        KEYWORDS_TO_IMAGES.put("collection|verre|biere|bière", List.of(
                "https://images.unsplash.com/photo-1694903006266-cd0d42d8ae0b"));
        KEYWORDS_TO_IMAGES.put("trajet|livreur|livraison", List.of(
                "https://images.unsplash.com/photo-1699817359842-904bdd28c6f6"));
        KEYWORDS_TO_IMAGES.put("voiture|automobile|covoiturage", List.of(
                "https://images.unsplash.com/photo-1565043666747-69f6646db940"));
        KEYWORDS_TO_IMAGES.put("materiel|matériel|equipement|équipement|outil|location", List.of(
                "https://images.unsplash.com/photo-1685320198649-781e83a61de4",
                "https://images.unsplash.com/photo-1731694411560-050e5b91e943"));
        // "dons"/"donation" (pas "don" seul, sous-mot de "donc") pour eviter un faux positif sur
        // n'importe quelle description contenant ce connecteur tres courant.
        KEYWORDS_TO_IMAGES.put("dons|donation|collecte de fonds|financement|levee de fonds|levée de fonds", List.of(
                "https://images.unsplash.com/photo-1783227610898-d53b8125c4b0"));
        KEYWORDS_TO_IMAGES.put("benevole|bénévole|benevolat|bénévolat", List.of(
                "https://images.unsplash.com/photo-1681949103006-70066fb25dfe"));
        KEYWORDS_TO_IMAGES.put("communication|newsletter|reseaux sociaux|réseaux sociaux", List.of(
                "https://images.unsplash.com/photo-1611926653458-09294b3142bf"));
        KEYWORDS_TO_IMAGES.put("stock|inventaire|entrepot|entrepôt", List.of(
                "https://images.unsplash.com/photo-1672552226380-486fe900b322"));
        KEYWORDS_TO_IMAGES.put("sante|santé|medical|médical|pharmacie", List.of(
                "https://images.unsplash.com/photo-1580281657527-47f249e8f4df"));
        KEYWORDS_TO_IMAGES.put("adhesion|adhésion|cotisation|membre", List.of(
                "https://images.unsplash.com/photo-1597463330912-eb868206b68e"));
        // Catégorie la plus générique, donc la plus susceptible de recevoir plusieurs projets
        // différents : c'est ici que la variation entre plusieurs photos compte le plus.
        KEYWORDS_TO_IMAGES.put("brocante|seconde main|occasion|marche|marché", List.of(
                "https://images.unsplash.com/photo-1760625345932-448b852afdf9",
                "https://images.unsplash.com/photo-1685883518161-63ccb05aef83"));
    }

    // Photo neutre (bureau, écran, gestion) utilisée si aucun mot-clé ne correspond
    private static final String DEFAULT_IMAGE = "https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d";
    private static final String IMAGE_PARAMS = "?w=1200&q=80&auto=format&fit=crop";

    public String pickImageFor(String name, String description) {
        String rawText = (name == null ? "" : name) + " " + (description == null ? "" : description);
        String text = normalize(rawText);
        for (Map.Entry<String, List<String>> entry : KEYWORDS_TO_IMAGES.entrySet()) {
            if (Pattern.compile(entry.getKey()).matcher(text).find()) {
                return pickVariant(entry.getValue(), rawText) + IMAGE_PARAMS;
            }
        }
        return DEFAULT_IMAGE + IMAGE_PARAMS;
    }

    // Choisit toujours la même photo pour un même nom+description (stable d'un rechargement à
    // l'autre), mais répartit les projets d'une même catégorie sur les différentes photos
    // disponibles plutôt que d'afficher systématiquement la première.
    private String pickVariant(List<String> options, String rawText) {
        if (options.size() == 1) return options.get(0);
        int index = Math.floorMod(rawText.hashCode(), options.size());
        return options.get(index);
    }

    private String normalize(String s) {
        return Normalizer.normalize(s.toLowerCase(), Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }
}
