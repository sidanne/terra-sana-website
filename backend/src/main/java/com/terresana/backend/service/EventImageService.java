package com.terresana.backend.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Choisit automatiquement une photo pour un événement quand l'admin n'en fournit pas
 * (l'admin n'a généralement pas d'URL d'image sous la main). On cherche des mots-clés
 * dans le titre + la description, et on associe la première catégorie qui correspond
 * à une vraie photo Unsplash déjà vérifiée. Aucun appel réseau : tout est en dur,
 * donc pas de risque d'image cassée ni de dépendance externe au moment de la création.
 */
@Service
public class EventImageService {

    // Ordre important : la première catégorie dont un mot-clé apparaît dans le texte est retenue.
    // Chaque catégorie a une ou plusieurs photos : quand plusieurs événements tombent dans la même
    // catégorie, ils n'affichent pas forcément tous la même image (voir pickVariant).
    private static final Map<String, List<String>> KEYWORDS_TO_IMAGES = new LinkedHashMap<>();
    static {
        // Termes très spécifiques d'abord (sinon un mot générique comme "vente" capture tout avant
        // qu'on ait pu vérifier s'il s'agit précisément de vêtements, de nourriture, etc.)
        KEYWORDS_TO_IMAGES.put("cuisine|culinaire|repas|recette|cuisiner", List.of(
                "https://images.unsplash.com/photo-1636647511729-6703539ba71f",
                "https://images.unsplash.com/photo-1683624328172-88fb24625ec1"));
        KEYWORDS_TO_IMAGES.put("vetement|vêtement|chaussure|friperie|textile", List.of(
                "https://images.unsplash.com/photo-1629426958003-35a5583b2977",
                "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7"));
        // "don" (pas "dons") est volontairement exclu : c'est un sous-mot de "donc", un connecteur
        // français extrêmement courant — le garder aurait déclenché cette catégorie sur n'importe
        // quelle description contenant "donc" quelque part, sans rapport avec un don alimentaire.
        // "distribution" seul est trop large (distribution de magazines, de flyers... rien à voir
        // avec de la nourriture) : qualifié en "distribution alimentaire" uniquement.
        KEYWORDS_TO_IMAGES.put("distribution alimentaire|dons|don alimentaire|alimentaire|panier|nourriture|petit dejeuner|petit déjeuner", List.of(
                "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
                "https://images.unsplash.com/photo-1628717341663-0007b0ee2597"));
        KEYWORDS_TO_IMAGES.put("bio|producteur|legume|légume|fruit|ferme|recolte|récolte|jardin", List.of(
                "https://images.unsplash.com/photo-1598962099619-528a224cb625"));
        KEYWORDS_TO_IMAGES.put("formation|informatique|cours|apprentissage|atelier numerique|atelier numérique", List.of(
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c"));
        KEYWORDS_TO_IMAGES.put("orphelinat|visite|enfant|maison de repos|accompagnement", List.of(
                "https://images.unsplash.com/photo-1521791136064-7986c2920216"));
        KEYWORDS_TO_IMAGES.put("poisson|poissonnerie|peche|pêche|fruits de mer|crevette", List.of(
                "https://images.unsplash.com/photo-1759487610611-4e302bf60e43",
                "https://images.unsplash.com/photo-1611214774777-3d997a9d0e35"));
        KEYWORDS_TO_IMAGES.put("pharmacie|pharmaceutique|medicament|médicament|sante|santé", List.of(
                "https://images.unsplash.com/photo-1580281657527-47f249e8f4df"));
        KEYWORDS_TO_IMAGES.put("cosmetique|cosmétique|beaute|beauté|maquillage|parfum", List.of(
                "https://images.unsplash.com/photo-1631730486572-226d1f595b68"));
        KEYWORDS_TO_IMAGES.put("sport|randonnee|randonnée|activite physique|activité physique", List.of(
                "https://images.unsplash.com/photo-1629185752152-fe65698ddee4"));
        KEYWORDS_TO_IMAGES.put("concert|musique|spectacle|exposition|festival", List.of(
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"));
        KEYWORDS_TO_IMAGES.put("nettoyage|environnement|proprete|propreté|dechets|déchets|ramassage", List.of(
                "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb"));
        KEYWORDS_TO_IMAGES.put("gala|collecte de fonds|financement|levee de fonds|levée de fonds", List.of(
                "https://images.unsplash.com/photo-1783227610898-d53b8125c4b0"));
        KEYWORDS_TO_IMAGES.put("chaise|mobilier|mariage|reception|réception", List.of(
                "https://images.unsplash.com/photo-1559982240-f760db87b822"));
        KEYWORDS_TO_IMAGES.put("hotel|hôtel|hebergement|hébergement", List.of(
                "https://images.unsplash.com/photo-1742844551970-ce693b4f05ed"));
        KEYWORDS_TO_IMAGES.put("voiture|automobile|covoiturage", List.of(
                "https://images.unsplash.com/photo-1565043666747-69f6646db940"));
        KEYWORDS_TO_IMAGES.put("magazine|presse|journal|revue|actualite|actualité", List.of(
                "https://images.unsplash.com/photo-1750684333876-07303b57fb13"));
        // Termes génériques en dernier : capturent les brocantes/marchés qui n'ont pas déjà été
        // reconnus comme quelque chose de plus précis ci-dessus. "vente" seul est volontairement
        // exclu d'ici : un simple mot signifiant "à vendre" ne dit rien sur le type de produit
        // (c'est justement ce qui causait des images fausses pour "vente des poissons"/"vente de
        // produit pharmaceutique" — désormais captés par leurs catégories dédiées ci-dessus, et tout
        // le reste retombe sagement sur DEFAULT_IMAGE plutôt qu'une photo de vêtements au hasard).
        // Catégorie la plus générique, donc la plus susceptible de recevoir plusieurs événements
        // différents : c'est ici que la variation entre plusieurs photos compte le plus.
        KEYWORDS_TO_IMAGES.put("marche|marché|brocante", List.of(
                "https://images.unsplash.com/photo-1760625345932-448b852afdf9",
                "https://images.unsplash.com/photo-1685883518161-63ccb05aef83"));
    }

    // Photo neutre (bénévoles main dans la main) utilisée si aucun mot-clé ne correspond
    private static final String DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521791136064-7986c2920216";
    private static final String IMAGE_PARAMS = "?w=1200&q=80&auto=format&fit=crop";

    public String pickImageFor(String title, String description) {
        String rawText = (title == null ? "" : title) + " " + (description == null ? "" : description);
        String text = normalize(rawText);
        for (Map.Entry<String, List<String>> entry : KEYWORDS_TO_IMAGES.entrySet()) {
            if (Pattern.compile(entry.getKey()).matcher(text).find()) {
                return pickVariant(entry.getValue(), rawText) + IMAGE_PARAMS;
            }
        }
        return DEFAULT_IMAGE + IMAGE_PARAMS;
    }

    // Choisit toujours la même photo pour un même titre+description (stable d'un rechargement à
    // l'autre), mais répartit les événements d'une même catégorie sur les différentes photos
    // disponibles plutôt que d'afficher systématiquement la première — sinon deux événements sur le
    // même sujet (ex. deux ventes de poissons) se retrouvent avec une image strictement identique.
    private String pickVariant(List<String> options, String rawText) {
        if (options.size() == 1) return options.get(0);
        int index = Math.floorMod(rawText.hashCode(), options.size());
        return options.get(index);
    }

    // Enlève les accents pour que la recherche de mots-clés fonctionne peu importe l'orthographe utilisée
    private String normalize(String s) {
        String withoutAccents = Normalizer.normalize(s.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents;
    }
}
