package com.terresana.backend.service;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.model.Review;
import com.terresana.backend.model.enums.EventStatus;
import com.terresana.backend.model.enums.RegistrationStatus;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Génère les documents PDF du module bénévoles avec iText7 :
 * attestations de participation (RG-21) et exports de listes d'inscrits (RG-22).
 */
@Service
public class PdfService {

    private static final DeviceRgb GREEN = new DeviceRgb(45, 106, 79);
    private static final DeviceRgb GREY = new DeviceRgb(120, 120, 120);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH:mm");

    // RG-21 — Génère l'attestation uniquement si la participation est confirmée et l'événement terminé
    public byte[] generateAttestation(AppUser user, Event event, Registration registration) {
        if (registration.getStatus() != RegistrationStatus.CONFIRMED) {
            throw new RuntimeException("Attestation disponible uniquement pour une participation confirmée.");
        }
        if (event.getStatus() != EventStatus.FINISHED) {
            throw new RuntimeException("Attestation disponible uniquement après la fin de l'événement.");
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        // try-with-resources ferme automatiquement le document (et finalise l'écriture du PDF) à la sortie du bloc
        try (PdfDocument pdf = new PdfDocument(new PdfWriter(out)); Document doc = new Document(pdf)) {

            doc.add(new Paragraph("TERRA SANA ASBL")
                    .setFontColor(GREEN).setBold().setFontSize(22)
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph("53/3, 1200 Woluwe-Saint-Lambert — Belgique")
                    .setFontSize(10).setFontColor(GREY)
                    .setTextAlignment(TextAlignment.CENTER).setMarginBottom(50));

            doc.add(new Paragraph("ATTESTATION DE PARTICIPATION BÉNÉVOLE")
                    .setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER).setMarginBottom(40));

            doc.add(new Paragraph("Terra Sana ASBL certifie que :")
                    .setFontSize(12).setMarginBottom(10));
            doc.add(new Paragraph(user.getFirstName() + " " + user.getLastName())
                    .setBold().setFontSize(15).setFontColor(GREEN).setMarginBottom(20));

            doc.add(new Paragraph(
                    "a participé en tant que bénévole à l'événement « " + event.getTitle() + " », " +
                    "organisé le " + event.getEventDate().format(DATETIME_FMT) + " à " + event.getLocation() + "."
            ).setFontSize(12).setMarginBottom(10));

            doc.add(new Paragraph(
                    "Cette attestation est délivrée à la demande de l'intéressé(e) pour faire valoir ce que de droit."
            ).setFontSize(12).setMarginBottom(60));

            doc.add(new Paragraph("Fait à Bruxelles, le " + LocalDate.now().format(DATE_FMT))
                    .setFontSize(11).setTextAlignment(TextAlignment.RIGHT));
            doc.add(new Paragraph("Pour Terra Sana ASBL")
                    .setFontSize(11).setBold().setFontColor(GREEN).setTextAlignment(TextAlignment.RIGHT));
        }
        return out.toByteArray();
    }

    // RG-22 — Export PDF de la liste des inscrits, réservé à l'administrateur (contrôle fait au niveau du contrôleur)
    public byte[] generateRegistrationsList(Event event, List<Registration> registrations) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PdfDocument pdf = new PdfDocument(new PdfWriter(out)); Document doc = new Document(pdf)) {

            doc.add(new Paragraph("TERRA SANA ASBL")
                    .setFontColor(GREEN).setBold().setFontSize(18));
            doc.add(new Paragraph("Liste des inscrits").setFontSize(13).setMarginBottom(16));

            doc.add(new Paragraph(event.getTitle()).setBold().setFontSize(14));
            doc.add(new Paragraph(
                    "Date : " + event.getEventDate().format(DATETIME_FMT) + "   |   Lieu : " + event.getLocation() +
                    "   |   Places : " + event.getMaxPlaces()
            ).setFontSize(10).setFontColor(GREY).setMarginBottom(20));

            // Tableau à 4 colonnes de largeurs relatives (%) : Nom, Email, Statut, Date d'inscription
            Table table = new Table(UnitValue.createPercentArray(new float[]{30, 32, 18, 20})).useAllAvailableWidth();
            for (String header : new String[]{"Nom", "Email", "Statut", "Inscrit le"}) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setBold().setFontColor(new DeviceRgb(255, 255, 255)))
                        .setBackgroundColor(GREEN).setPadding(6));
            }
            for (Registration r : registrations) {
                table.addCell(new Cell().add(new Paragraph(r.getUser().getFirstName() + " " + r.getUser().getLastName())).setPadding(6));
                table.addCell(new Cell().add(new Paragraph(r.getUser().getEmail())).setPadding(6));
                table.addCell(new Cell().add(new Paragraph(r.getStatus().name())).setPadding(6));
                table.addCell(new Cell().add(new Paragraph(r.getCreatedAt().format(DATE_FMT))).setPadding(6));
            }
            doc.add(table);

            doc.add(new Paragraph("Total : " + registrations.size() + " inscription(s)")
                    .setFontSize(10).setFontColor(GREY).setMarginTop(14));
            doc.add(new Paragraph("Document généré le " + LocalDate.now().format(DATE_FMT))
                    .setFontSize(9).setFontColor(GREY));
        }
        return out.toByteArray();
    }

    // RG-21 — Export PDF de l'historique de participation d'un bénévole (événements confirmés et terminés uniquement)
    public byte[] generateParticipationHistory(AppUser user, List<Registration> registrations, Map<Long, Review> reviewsByEventId) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PdfDocument pdf = new PdfDocument(new PdfWriter(out)); Document doc = new Document(pdf)) {

            doc.add(new Paragraph("TERRA SANA ASBL")
                    .setFontColor(GREEN).setBold().setFontSize(18));
            doc.add(new Paragraph("Historique de participation").setFontSize(13).setMarginBottom(4));
            doc.add(new Paragraph(user.getFirstName() + " " + user.getLastName())
                    .setBold().setFontSize(14).setFontColor(GREEN).setMarginBottom(20));

            List<Registration> completed = registrations.stream()
                    .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED && r.getEvent().getStatus() == EventStatus.FINISHED)
                    .toList();

            // Tableau à 3 colonnes de largeurs relatives (%) : Événement, Date, Évaluation
            Table table = new Table(UnitValue.createPercentArray(new float[]{45, 25, 30})).useAllAvailableWidth();
            for (String header : new String[]{"Événement", "Date", "Évaluation"}) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setBold().setFontColor(new DeviceRgb(255, 255, 255)))
                        .setBackgroundColor(GREEN).setPadding(6));
            }
            for (Registration r : completed) {
                Review review = reviewsByEventId.get(r.getEvent().getId());
                String note = review != null ? review.getRating() + " / 5" : "—";
                table.addCell(new Cell().add(new Paragraph(r.getEvent().getTitle())).setPadding(6));
                table.addCell(new Cell().add(new Paragraph(r.getEvent().getEventDate().format(DATE_FMT))).setPadding(6));
                table.addCell(new Cell().add(new Paragraph(note)).setPadding(6));
            }
            doc.add(table);

            doc.add(new Paragraph("Total : " + completed.size() + " participation(s) confirmée(s)")
                    .setFontSize(10).setFontColor(GREY).setMarginTop(14));
            doc.add(new Paragraph("Document généré le " + LocalDate.now().format(DATE_FMT))
                    .setFontSize(9).setFontColor(GREY));
        }
        return out.toByteArray();
    }
}
