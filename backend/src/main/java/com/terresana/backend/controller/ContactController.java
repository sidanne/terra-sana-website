package com.terresana.backend.controller;

import com.terresana.backend.model.ContactMessage;
import com.terresana.backend.repository.ContactMessageRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactMessageRepository repo;

    public ContactController(ContactMessageRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ContactMessage send(@RequestBody ContactMessage message) {
        message.setCreatedAt(LocalDateTime.now());
        return repo.save(message);
    }
}