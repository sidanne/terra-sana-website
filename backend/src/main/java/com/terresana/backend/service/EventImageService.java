package com.terresana.backend.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.LinkedHashMap;
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
    private static final Map<String, String> KEYWORDS_TO_IMAGE = new LinkedHashMap<>();
    static {
        // Termes très spécifiques d'abord (sinon un mot générique comme "vente" capture tout avant
        // qu'on ait pu vérifier s'il s'agit précisément de vêtements, de nourriture, etc.)
        KEYWORDS_TO_IMAGE.put("cuisine|culinaire|repas|recette|cuisiner",
                "https://images.unsplash.com/photo-1636647511729-6703539ba71f");
        KEYWORDS_TO_IMAGE.put("vetement|vêtement|chaussure|friperie|textile",
                "https://images.unsplash.com/photo-1629426958003-35a5583b2977");
        // "don" (pas "dons") est volontairement exclu : c'est un sous-mot de "donc", un connecteur
        // français extrêmement courant — le garder aurait déclenché cette catégorie sur n'importe
        // quelle description contenant "donc" quelque part, sans rapport avec un don alimentaire.
        KEYWORDS_TO_IMAGE.put("distribution|dons|don alimentaire|alimentaire|panier|nourriture|petit dejeuner|petit déjeuner",
                "https://images.unsplash.com/photo-1608198093002-ad4e005484ec");
        KEYWORDS_TO_IMAGE.put("bio|producteur|legume|légume|fruit|ferme|recolte|récolte|jardin",
                "https://images.unsplash.com/photo-1598962099619-528a224cb625");
        KEYWORDS_TO_IMAGE.put("formation|informatique|cours|apprentissage|atelier numerique|atelier numérique",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c");
        KEYWORDS_TO_IMAGE.put("orphelinat|visite|enfant|maison de repos|accompagnement",
                "https://images.unsplash.com/photo-1521791136064-7986c2920216");
        KEYWORDS_TO_IMAGE.put("poisson|poissonnerie|peche|pêche|fruits de mer|crevette",
                "https://images.unsplash.com/photo-1759487610611-4e302bf60e43");
        KEYWORDS_TO_IMAGE.put("pharmacie|pharmaceutique|medicament|médicament|sante|santé",
                "https://images.unsplash.com/photo-1580281657527-47f249e8f4df");
        KEYWORDS_TO_IMAGE.put("cosmetique|cosmétique|beaute|beauté|maquillage|parfum",
                "https://images.unsplash.com/photo-1631730486572-226d1f595b68");
        KEYWORDS_TO_IMAGE.put("sport|randonnee|randonnée|activite physique|activité physique",
                "https://images.unsplash.com/photo-1629185752152-fe65698ddee4");
        KEYWORDS_TO_IMAGE.put("concert|musique|spectacle|exposition|festival",
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a");
        KEYWORDS_TO_IMAGE.put("nettoyage|environnement|proprete|propreté|dechets|déchets|ramassage",
                "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb");
        KEYWORDS_TO_IMAGE.put("gala|collecte de fonds|financement|levee de fonds|levée de fonds",
                "https://images.unsplash.com/photo-1783227610898-d53b8125c4b0");
        KEYWORDS_TO_IMAGE.put("chaise|mobilier|mariage|reception|réception",
                "https://images.unsplash.com/photo-1559982240-f760db87b822");
        KEYWORDS_TO_IMAGE.put("hotel|hôtel|hebergement|hébergement",
                "https://images.unsplash.com/photo-1742844551970-ce693b4f05ed");
        KEYWORDS_TO_IMAGE.put("voiture|automobile|covoiturage",
                "https://images.unsplash.com/photo-1565043666747-69f6646db940");
        // Termes génériques en dernier : capturent les brocantes/marchés qui n'ont pas déjà été
        // reconnus comme quelque chose de plus précis ci-dessus. "vente" seul est volontairement
        // exclu d'ici : un simple mot signifiant "à vendre" ne dit rien sur le type de produit
        // (c'est justement ce qui causait des images fausses pour "vente des poissons"/"vente de
        // produit pharmaceutique" — désormais captés par leurs catégories dédiées ci-dessus, et tout
        // le reste retombe sagement sur DEFAULT_IMAGE plutôt qu'une photo de vêtements au hasard).
        KEYWORDS_TO_IMAGE.put("marche|marché|brocante",
                "https://images.unsplash.com/photo-1760625345932-448b852afdf9");
    }

    // Photo neutre (bénévoles main dans la main) utilisée si aucun mot-clé ne correspond
    private static final String DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521791136064-7986c2920216";
    private static final String IMAGE_PARAMS = "?w=1200&q=80&auto=format&fit=crop";

    public String pickImageFor(String title, String description) {
        String text = normalize((title == null ? "" : title) + " " + (description == null ? "" : description));
        for (Map.Entry<String, String> entry : KEYWORDS_TO_IMAGE.entrySet()) {
            if (Pattern.compile(entry.getKey()).matcher(text).find()) {
                return entry.getValue() + IMAGE_PARAMS;
            }
        }
        return DEFAULT_IMAGE + IMAGE_PARAMS;
    }

    // Enlève les accents pour que la recherche de mots-clés fonctionne peu importe l'orthographe utilisée
    private String normalize(String s) {
        String withoutAccents = Normalizer.normalize(s.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents;
    }
}
