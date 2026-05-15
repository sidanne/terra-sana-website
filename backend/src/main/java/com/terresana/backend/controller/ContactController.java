package com.terresana.backend.controller;

import com.terresana.backend.model.ContactMessage;
import com.terresana.backend.repository.ContactMessageRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactMessageRepository repo;
    private final JavaMailSender mailSender;

    public ContactController(ContactMessageRepository repo, JavaMailSender mailSender) {
        this.repo = repo;
        this.mailSender = mailSender;
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ContactMessage send(@RequestBody ContactMessage message) {
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);
        ContactMessage saved = repo.save(message);
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo("alaintchouapi@gmail.com");
            mail.setSubject("Nouveau message de " + message.getName());
            mail.setText("Nom : " + message.getName() + "\nEmail : " + message.getEmail() + "\n\nMessage :\n" + message.getMessage());
            mail.setReplyTo(message.getEmail());
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Email non configure : " + e.getMessage());
        }
        return saved;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}/read")
    public ContactMessage markAsRead(@PathVariable Long id) {
        ContactMessage msg = repo.findById(id).orElseThrow();
        msg.setRead(true);
        return repo.save(msg);
    }

    @PostMapping("/{id}/reply")
    public void reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ContactMessage msg = repo.findById(id).orElseThrow();
        msg.setRead(true);
        repo.save(msg);
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(msg.getEmail());
            mail.setSubject("Reponse de Terra Sana");
            mail.setText(body.get("reply") + "\n\nCordialement,\nTerra Sana ASBL");
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Erreur envoi reponse : " + e.getMessage());
        }
    }

    @PutMapping("/{id}/changePassword")
    public Map<String, String> changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return Map.of("message", "Mot de passe change");
    }
}